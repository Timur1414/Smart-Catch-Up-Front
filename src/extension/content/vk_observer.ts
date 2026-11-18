import { injectNotificationToggle } from "./injector";


// function findNotificationHeader(): HTMLElement | null {
//     const candidates = document.querySelectorAll<HTMLElement>("span, div, h1, h2, h3, h4");
//     for (const el of candidates) {
//         if (el.children.length === 0 && el.textContent?.trim() === "Уведомления" && el.offsetParent !== null) {
//             const btnOrTitle = el.closest<HTMLElement>("button, [role='button'], [class*='vkit-']") || el.parentElement;
//             if (btnOrTitle && btnOrTitle.parentElement) {
//                 console.log("[VK Smart Catch-Up] elem:", el);
//                 return btnOrTitle.parentElement;
//             }
//         }
//     }
//     return null;
// }

function tryInject(): void {
    if (document.getElementById("smart-catch-up-toggle-wrap")) {
        return;
    }

    // const headerBar = findNotificationHeader();
    const headerBar = document.querySelector<HTMLElement>("div[role=list]");
    if (headerBar?.parentElement?.parentElement) {
        injectNotificationToggle(headerBar.parentElement);
    }
}


export function initVKObserver(): void {
    // console.log("[VK Smart Catch-Up] Observer active, waiting for notifications section...");
    // tryInject();
    // const observer = new MutationObserver(() => {
    //     tryInject();
    // });
    // observer.observe(document.body, {
    //     childList: true,
    //     subtree: true,
    // });

    document.addEventListener("click", (e) => {
        const target = e.target as HTMLElement | null;
        if (!target) return;
        const isBellClick = Boolean(
            target.parentElement?.firstChild?.textContent === "Уведомления" || target.firstChild?.textContent === "Уведомления"
        );
        if (isBellClick) {
            console.log("[VK Smart Catch-Up] Bell clicked");
            setTimeout(tryInject, 50);
            setTimeout(tryInject, 150);
            setTimeout(tryInject, 300);
            setTimeout(tryInject, 500);
        }
    }, true);
}
