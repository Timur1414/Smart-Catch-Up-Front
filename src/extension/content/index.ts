import { init_VK_observer } from "./vk_observer";

function init() {
    console.log("[VK Smart Catch-Up] Extension initialised on", window.location.href);
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            init_VK_observer();
        });
    }
    else {
        init_VK_observer();
    }
}

init();
