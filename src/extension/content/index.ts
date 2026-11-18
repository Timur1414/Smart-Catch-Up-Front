import { initVKObserver } from "./vk_observer";

console.log("[VK Smart Catch-Up] Extension initialised on", window.location.href);

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        initVKObserver();
    });
} else {
    initVKObserver();
}
