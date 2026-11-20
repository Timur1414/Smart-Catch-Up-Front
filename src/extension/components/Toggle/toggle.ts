const TOGGLE_CONTAINER_ID = "smart-catch-up-toggle-wrap";


export function get_toggle_element(isEnabled: boolean): HTMLDivElement {
    const toggle: HTMLDivElement = document.createElement('div');
    toggle.id = TOGGLE_CONTAINER_ID;
    toggle.style.cssText = `
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 8px;
        margin-right: 8px;
        cursor: pointer;
        user-select: none;
        border-radius: 8px;
        background: var(--vkui--color_background_secondary, rgba(255, 255, 255, 0.08));
        transition: all 0.2s ease;
        z-index: 999;
        flex-shrink: 0;
        `;
    toggle.innerHTML = `
        <span style="
            font-size: 12px;
            font-weight: 600;
            color: var(--vkui--color_text_subhead, #828282);
            display: inline-flex;
            align-items: center;
            gap: 4px;
            line-height: 1;
        ">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style="flex-shrink: 0;">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="${isEnabled ? 'var(--vkui--color_icon_accent, #2688eb)' : 'var(--vkui--color_icon_secondary, #828282)'}"/>
            </svg>
            Smart Catch-Up
        </span>
        <div class="scu-switch-track" style="
            position: relative;
            width: 28px;
            height: 16px;
            background-color: ${isEnabled ? 'var(--vkui--color_background_accent, #2688eb)' : 'var(--vkui--color_icon_tertiary, #555555)'};
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
    return toggle;
}
