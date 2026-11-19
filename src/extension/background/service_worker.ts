import MessageSender = chrome.runtime.MessageSender;

console.log('[VK Smart Catch-Up] Background Service Worker started');

chrome.runtime.onInstalled.addListener(() => {
    console.log('[VK Smart Catch-Up] Extension installed');
});

chrome.runtime.onMessage.addListener((message: any, _sender: MessageSender, send_response: (response: any) => void) => {
    if (message.type === "SET_NOTIFICATION_STATUS") {
        (async () => {
            try {
                if (!message.enabled) {
                    send_response({ success: true, data: null });
                    return;
                }
                const response: Response = await fetch("http://localhost:8080/api/ext/digest");
                if (!response.ok) {
                    console.error(`Server returned ${response.status}`);
                    send_response({ success: false, status: response.status });
                    return;
                }
                const data: any = await response.json();
                send_response({ success: true, data: data });
            } catch (error: any) {
                console.error("[VK Smart Catch-Up] Background fetch error:", error);
                send_response({ success: false, error: error.message });
            }
        })();
        return true;
    }
});
