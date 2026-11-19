import { injectNotificationToggle } from "./injector";


async function try_inject(): Promise<boolean> {
    if (document.getElementById("smart-catch-up-toggle-wrap"))
        return true;
    const notify_list: HTMLElement | null = document.querySelector<HTMLElement>("div[role=list]");
    if (notify_list?.parentElement?.parentElement) {
        await injectNotificationToggle(notify_list.parentElement);
        return true;
    }
    return false;
}


export function init_VK_observer(): void {
    // console.log("[VK Smart Catch-Up] Observer active, waiting for notifications section...");
    // try_inject();
    // const observer = new MutationObserver(() => {
    //     try_inject();
    // });
    // observer.observe(document.body, {
    //     childList: true,
    //     subtree: true,
    // });

    document.addEventListener("click", async (e) => {
        const target = e.target as HTMLElement | null;
        if (!target) return;
        const is_bell_clicked: boolean = Boolean(
            target.parentElement?.firstChild?.textContent === "Уведомления" || target.firstChild?.textContent === "Уведомления"
        );
        if (is_bell_clicked) {
            console.log("[VK Smart Catch-Up] Bell clicked");
            while (!(await try_inject())) {
                setInterval(() => {}, 100);
            }
        }
    }, true);
}
