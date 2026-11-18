console.log('[VK Smart Catch-Up] Background Service Worker started');

chrome.runtime.onInstalled.addListener(() => {
    console.log('[VK Smart Catch-Up] Extension installed');
});
