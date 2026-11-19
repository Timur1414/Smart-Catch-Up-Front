import { get_toggle_element } from "../components/Toggle/toggle";
import {
    create_digest_element,
    populate_digest_content,
    set_digest_loading,
    set_digest_error,
    DigestData,
} from "../components/Digest/digest";

const TOGGLE_CONTAINER_ID = "smart-catch-up-toggle-wrap";
const DIGEST_CONTAINER_ID = "smart-catch-up-digest-wrap";
const STORAGE_KEY = "smart_catch_up_notifications_enabled";

let cachedDigestData: DigestData | null = null;

export function updateToggleUi(toggle: HTMLElement, active: boolean): void {
    const track = toggle.querySelector(".scu-switch-track") as HTMLElement;
    const thumb = toggle.querySelector(".scu-switch-thumb") as HTMLElement;
    const iconPath = toggle.querySelector("svg path") as SVGPathElement;

    if (track && thumb && iconPath) {
        track.style.backgroundColor = active ? "var(--vkui--color_background_accent, #2688eb)" : "var(--vkui--color_icon_tertiary, #555555)";
        thumb.style.left = active ? "14px" : "2px";
        iconPath.setAttribute("fill", active ? "var(--vkui--color_icon_accent, #2688eb)" : "var(--vkui--color_icon_secondary, #828282)");
    }
}

export function updateDisplayVisibility(active: boolean): void {
    const notifyList = document.querySelector<HTMLElement>("div[role=list]");
    const digestContainer = document.getElementById(DIGEST_CONTAINER_ID);

    if (notifyList) {
        notifyList.style.display = active ? "none" : "";
    }
    if (digestContainer) {
        digestContainer.style.display = active ? "block" : "none";
    }
}

function ensureDigestContainer(notifyList?: HTMLElement | null): HTMLElement {
    let digestContainer = document.getElementById(DIGEST_CONTAINER_ID);
    if (!digestContainer) {
        digestContainer = create_digest_element();
        const list = notifyList ?? document.querySelector<HTMLElement>("div[role=list]");
        if (list) {
            list.insertAdjacentElement("afterend", digestContainer);
        }
    }
    return digestContainer;
}

export async function fetchAndRenderDigest(notifyList?: HTMLElement | null): Promise<void> {
    const digestContainer = ensureDigestContainer(notifyList);
    set_digest_loading(digestContainer);

    try {
        const response = await chrome.runtime.sendMessage({
            type: "SET_NOTIFICATION_STATUS",
            enabled: true,
        });

        if (!response?.success) {
            console.error(`[VK Smart Catch-Up] Server error or request failed`, response);
            set_digest_error(digestContainer, "Не удалось загрузить дайджест");
            return;
        }

        const data: DigestData = response.data?.data ?? response.data;
        cachedDigestData = data;
        populate_digest_content(digestContainer, data);
    } catch (error: any) {
        console.error("[VK Smart Catch-Up] Error fetching digest:", error);
        set_digest_error(digestContainer, "Ошибка при получении дайджеста");
    }
}

export async function syncNotificationState(): Promise<void> {
    const data = await chrome.storage.local.get([STORAGE_KEY]);
    const isEnabled: boolean = Boolean(data[STORAGE_KEY] ?? false);

    const toggle = document.getElementById(TOGGLE_CONTAINER_ID);
    if (toggle) {
        updateToggleUi(toggle, isEnabled);
    }

    const notifyList = document.querySelector<HTMLElement>("div[role=list]");
    ensureDigestContainer(notifyList);
    updateDisplayVisibility(isEnabled);

    if (isEnabled && !cachedDigestData) {
        await fetchAndRenderDigest(notifyList);
    }
}

export async function injectNotificationToggle(
    container: HTMLElement,
    notifyList?: HTMLElement | null
): Promise<void> {
    if (document.getElementById(TOGGLE_CONTAINER_ID)) {
        await syncNotificationState();
        return;
    }

    const data = await chrome.storage.local.get([STORAGE_KEY]);
    let is_enabled: boolean = Boolean(data[STORAGE_KEY] ?? false);

    const toggle: HTMLDivElement = get_toggle_element(is_enabled);

    ensureDigestContainer(notifyList);
    updateDisplayVisibility(is_enabled);

    if (is_enabled) {
        fetchAndRenderDigest(notifyList);
    }

    toggle.addEventListener("click", async (e) => {
        e.stopPropagation();
        e.preventDefault();
        is_enabled = !is_enabled;

        updateToggleUi(toggle, is_enabled);
        updateDisplayVisibility(is_enabled);
        await chrome.storage.local.set({ [STORAGE_KEY]: is_enabled });

        console.log("[VK Smart Catch-Up] Notifications toggle is now:", is_enabled ? "ON" : "OFF");

        window.dispatchEvent(
            new CustomEvent("scu_notifications_toggle_change", {
                detail: { enabled: is_enabled },
            })
        );

        if (is_enabled) {
            await fetchAndRenderDigest(notifyList);
        } else {
            try {
                await chrome.runtime.sendMessage({
                    type: "SET_NOTIFICATION_STATUS",
                    enabled: false,
                });
            } catch (err) {
                console.warn("[VK Smart Catch-Up] Failed to notify background about toggle off", err);
            }
        }
    });

    const computedDisplay: string = window.getComputedStyle(container).display;
    if (computedDisplay !== "flex" && computedDisplay !== "inline-flex") {
        container.style.display = "flex";
        container.style.alignItems = "center";
    }
    container.prepend(toggle);

    console.log("[VK Smart Catch-Up] Successfully injected toggle into header bar:", container);
}
