import { injectNotificationToggle, syncNotificationState } from "./injector";

async function try_inject(): Promise<boolean> {
    const notify_list: HTMLElement | null = document.querySelector<HTMLElement>("div[role=list]");
    if (notify_list?.parentElement?.parentElement) {
        if (document.getElementById("smart-catch-up-toggle-wrap")) {
            await syncNotificationState();
            return true;
        }
        await injectNotificationToggle(notify_list.parentElement, notify_list);
        return true;
    }
    return false;
}

export function init_VK_observer(): void {
    // const observer = new MutationObserver(() => {
    //     const notify_list = document.querySelector<HTMLElement>("div[role=list]");
    //     if (notify_list && !document.getElementById("smart-catch-up-toggle-wrap")) {
    //         try_inject();
    //     }
    // });
    //
    // observer.observe(document.body, {
    //     childList: true,
    //     subtree: true,
    // });

    document.addEventListener("click", async (e) => {
        const target = e.target as HTMLElement | null;
        if (!target) return;
        const is_bell_clicked: boolean = Boolean(
            target.parentElement?.firstChild?.textContent === "Уведомления" ||
            target.firstChild?.textContent === "Уведомления"
        );
        if (is_bell_clicked) {
            console.log("[VK Smart Catch-Up] Bell clicked");
            let attempts = 0;
            const timer = setInterval(async () => {
                attempts++;
                const injected = await try_inject();
                if (injected || attempts >= 20) {
                    clearInterval(timer);
                }
            }, 100);
        }
    }, true);
}
