const TOGGLE_CONTAINER_ID = 'smart-catch-up-toggle-wrap';
const STORAGE_KEY = 'smart_catch_up_notifications_enabled';

/**
 * Создает и встраивает стилизованный toggle в шапку выпадающей панели колокольчика VK
 */
export async function injectNotificationToggle(headerBar: HTMLElement): Promise<void> {
    if (document.getElementById(TOGGLE_CONTAINER_ID)) {
        return;
    }

    const data = await chrome.storage.local.get([STORAGE_KEY]);
    let isEnabled: boolean = Boolean(data[STORAGE_KEY] ?? false);

    const toggleWrapper = document.createElement('div');
    toggleWrapper.id = TOGGLE_CONTAINER_ID;
    toggleWrapper.setAttribute('role', 'button');
    toggleWrapper.setAttribute('tabindex', '0');
    toggleWrapper.setAttribute('title', 'Smart Catch-Up: умный фильтр уведомлений');

    toggleWrapper.style.cssText = `
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 8px;
        margin-right: 8px;
        cursor: pointer;
        user-select: none;
        border-radius: 8px;
        background: var(--vkui--color_background_secondary, rgba(0, 0, 0, 0.05));
        transition: all 0.2s ease;
        z-index: 999;
        flex-shrink: 0;
    `;

    toggleWrapper.innerHTML = `
        <span style="
            font-size: 12px;
            font-weight: 600;
            color: var(--vkui--color_text_subhead, #6f7985);
            display: inline-flex;
            align-items: center;
            gap: 4px;
            line-height: 1;
        ">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style="flex-shrink: 0;">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="${isEnabled ? '#0077FF' : '#99a2ad'}"/>
            </svg>
            Catch-Up
        </span>
        <div class="scu-switch-track" style="
            position: relative;
            width: 28px;
            height: 16px;
            background-color: ${isEnabled ? '#0077FF' : '#b2b6ba'};
            border-radius: 8px;
            transition: background-color 0.2s ease;
            flex-shrink: 0;
        ">
            <div class="scu-switch-thumb" style="
                position: absolute;
                top: 2px;
                left: ${isEnabled ? '14px' : '2px'};
                width: 12px;
                height: 12px;
                background-color: #ffffff;
                border-radius: 50%;
                transition: left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 1px 2px rgba(0,0,0,0.3);
            "></div>
        </div>
    `;

    function updateUi(active: boolean) {
        const track = toggleWrapper.querySelector('.scu-switch-track') as HTMLElement;
        const thumb = toggleWrapper.querySelector('.scu-switch-thumb') as HTMLElement;
        const iconPath = toggleWrapper.querySelector('svg path') as SVGPathElement;

        if (track && thumb && iconPath) {
            track.style.backgroundColor = active ? '#0077FF' : '#b2b6ba';
            thumb.style.left = active ? '14px' : '2px';
            iconPath.setAttribute('fill', active ? '#0077FF' : '#99a2ad');
        }
    }

    toggleWrapper.addEventListener('click', async (e) => {
        e.stopPropagation();
        e.preventDefault();
        isEnabled = !isEnabled;
        updateUi(isEnabled);

        await chrome.storage.local.set({ [STORAGE_KEY]: isEnabled });
        console.log('[VK Smart Catch-Up] Notifications toggle is now:', isEnabled ? 'ON' : 'OFF');

        window.dispatchEvent(
            new CustomEvent('scu_notifications_toggle_change', {
                detail: { enabled: isEnabled },
            })
        );
    });

    // Убедимся, что контейнер шапки ведет себя как flexbox
    const computedDisplay = window.getComputedStyle(headerBar).display;
    if (computedDisplay !== 'flex' && computedDisplay !== 'inline-flex') {
        headerBar.style.display = 'flex';
        headerBar.style.alignItems = 'center';
    }

    // Вставляем первым дочерним элементом
    headerBar.prepend(toggleWrapper);

    console.log('[VK Smart Catch-Up] Successfully injected toggle into header bar:', headerBar);
}
