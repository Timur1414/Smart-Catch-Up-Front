import {get_toggle_element} from "../components/Toggle/toggle.ts";

const TOGGLE_CONTAINER_ID = "smart-catch-up-toggle-wrap";
const STORAGE_KEY = "smart_catch_up_notifications_enabled";


export async function injectNotificationToggle(container: HTMLElement): Promise<void> {
    if (document.getElementById(TOGGLE_CONTAINER_ID)) {
        return;
    }
    const data = await chrome.storage.local.get([STORAGE_KEY]);
    let is_enabled: boolean = Boolean(data[STORAGE_KEY] ?? false);

    const toggle: HTMLDivElement = get_toggle_element(is_enabled);
    // const toggle: HTMLDivElement = document.createElement('div');
    // toggle.id = TOGGLE_CONTAINER_ID;
    // toggle.setAttribute('role', 'button');
    // toggle.setAttribute('tabindex', '0');
    // toggle.setAttribute('title', 'Smart Catch-Up: умный фильтр уведомлений');
    // toggle.style.cssText = `
    //     display: inline-flex;
    //     align-items: center;
    //     gap: 6px;
    //     padding: 4px 8px;
    //     margin-right: 8px;
    //     cursor: pointer;
    //     user-select: none;
    //     border-radius: 8px;
    //     background: var(--vkui--color_background_secondary, rgba(0, 0, 0, 0.05));
    //     transition: all 0.2s ease;
    //     z-index: 999;
    //     flex-shrink: 0;
    // `;
    // toggle.innerHTML = `
    //     <span style="
    //         font-size: 12px;
    //         font-weight: 600;
    //         color: var(--vkui--color_text_subhead, #6f7985);
    //         display: inline-flex;
    //         align-items: center;
    //         gap: 4px;
    //         line-height: 1;
    //     ">
    //         <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style="flex-shrink: 0;">
    //             <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="${is_enabled ? '#0077FF' : '#99a2ad'}"/>
    //         </svg>
    //         Catch-Up
    //     </span>
    //     <div class="scu-switch-track" style="
    //         position: relative;
    //         width: 28px;
    //         height: 16px;
    //         background-color: ${is_enabled ? '#0077FF' : '#b2b6ba'};
    //         border-radius: 8px;
    //         transition: background-color 0.2s ease;
    //         flex-shrink: 0;
    //     ">
    //         <div class="scu-switch-thumb" style="
    //             position: absolute;
    //             top: 2px;
    //             left: ${is_enabled ? '14px' : '2px'};
    //             width: 12px;
    //             height: 12px;
    //             background-color: #ffffff;
    //             border-radius: 50%;
    //             transition: left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    //             box-shadow: 0 1px 2px rgba(0,0,0,0.3);
    //         "></div>
    //     </div>
    // `;

    function updateUi(active: boolean) {
        const track = toggle.querySelector('.scu-switch-track') as HTMLElement;
        const thumb = toggle.querySelector('.scu-switch-thumb') as HTMLElement;
        const iconPath = toggle.querySelector('svg path') as SVGPathElement;

        if (track && thumb && iconPath) {
            track.style.backgroundColor = active ? '#0077FF' : '#b2b6ba';
            thumb.style.left = active ? '14px' : '2px';
            iconPath.setAttribute('fill', active ? '#0077FF' : '#99a2ad');
        }
    }

    toggle.addEventListener("click", async (e) => {
        e.stopPropagation();
        e.preventDefault();
        is_enabled = !is_enabled;
        updateUi(is_enabled);
        await chrome.storage.local.set({ [STORAGE_KEY]: is_enabled });
        console.log("[VK Smart Catch-Up] Notifications toggle is now:", is_enabled ? "ON" : "OFF");
        window.dispatchEvent(
            new CustomEvent("scu_notifications_toggle_change", {
                detail: { enabled: is_enabled },
            })
        );
    });

    const computedDisplay: string = window.getComputedStyle(container).display;
    if (computedDisplay !== "flex" && computedDisplay !== "inline-flex") {
        container.style.display = "flex";
        container.style.alignItems = "center";
    }
    container.prepend(toggle);

    console.log("[VK Smart Catch-Up] Successfully injected toggle into header bar:", container);
}
