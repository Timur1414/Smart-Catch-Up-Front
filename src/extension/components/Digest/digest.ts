import { CategoryObject, ImportantCategoryObject } from "../../../types/objects_interfaces";
import { formatDigestCreationTime } from "../../../utils/date";
import { translated_clusters } from "../../../store/store";
import { create_digest_category_element } from "../DigestCategory/digest_component";

export interface DigestData {
    created_at?: string;
    important?: ImportantCategoryObject[];
    categories?: CategoryObject[];
}

const STYLES_ID = "smart-catch-up-styles";

export function inject_digest_styles(): void {
    if (document.getElementById(STYLES_ID)) {
        return;
    }
    const style = document.createElement("style");
    style.id = STYLES_ID;
    style.textContent = `
        .scu-digest-container {
            width: 100%;
            box-sizing: border-box;
            padding: 12px 16px;
            font-family: var(--vkui--font_family_base, -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', Arial, sans-serif);
            color: var(--vkui--color_text_primary, #e1e3e6);
        }

        .scu-digest-header {
            margin-bottom: 12px;
        }

        .scu-digest-title {
            font-size: 16px;
            font-weight: 700;
            margin: 0 0 4px 0;
            line-height: 1.25;
            color: var(--vkui--color_text_primary, #e1e3e6);
        }

        .scu-digest-date {
            font-size: 12px;
            color: var(--vkui--color_text_subhead, #828282);
            margin: 0;
            line-height: 1.3;
        }

        .scu-digest-content {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .scu-digest-empty,
        .scu-digest-loading,
        .scu-digest-error {
            padding: 24px 12px;
            text-align: center;
            color: var(--vkui--color_text_subhead, #828282);
            font-size: 14px;
            line-height: 1.4;
        }

        .scu-digest-error {
            color: var(--vkui--color_background_negative, #E64646);
        }

        .scu-digest-category_container {
            border: 1px solid var(--vkui--color_separator_primary, #363738);
            margin: 0;
            color: var(--vkui--color_text_primary, #e1e3e6);
            width: 100%;
            box-sizing: border-box;
            border-radius: var(--vkui--size_border_radius--regular, 8px);
            background-color: var(--vkui--color_background_secondary, #2c2d2e);
            cursor: pointer;
            display: grid;
            grid-template-rows: auto 0fr;
            transition: grid-template-rows 0.25s ease-in-out,
                        background-color 0.2s ease-in-out,
                        border-color 0.2s ease-in-out,
                        box-shadow 0.2s ease-in-out;
            overflow: hidden;
            user-select: none;
        }

        .scu-digest-category_container:hover {
            background-color: var(--vkui--color_background_contrast_themed, #363738);
            border-color: var(--vkui--color_separator_secondary, var(--vkui--color_separator_primary, #444445));
        }

        .scu-digest-category_container.scu-digest-category_open {
            grid-template-rows: auto 1fr;
            border-color: var(--vkui--color_stroke_accent, #71aaeb);
            background-color: var(--vkui--color_background_secondary, #2c2d2e);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .scu-digest-category_header {
            text-align: start;
            padding: 10px 14px;
            font-size: 14px;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: var(--vkui--color_text_primary, #e1e3e6);
        }

        .scu-digest-category_header_text {
            display: inline-block;
            margin: 0;
            color: inherit;
        }

        .scu-digest-category_header_arrow {
            width: 16px;
            height: 16px;
            transition: transform 0.25s ease-in-out, color 0.2s ease-in-out;
            flex-shrink: 0;
            color: var(--vkui--color_icon_secondary, #828282);
        }

        .scu-digest-category_header_arrow_open {
            transform: rotate(-180deg);
            color: var(--vkui--color_icon_accent, #71aaeb);
        }

        .scu-digest-category_content {
            overflow: hidden;
            min-height: 0;
            background-color: inherit;
            border-radius: 0 0 var(--vkui--size_border_radius--regular, 8px) var(--vkui--size_border_radius--regular, 8px);
            text-align: start;
            padding: 0 14px;
            transition: padding 0.25s ease-in-out;
        }

        .scu-digest-category_open .scu-digest-category_content {
            padding: 0 14px 12px 14px;
        }

        .scu-digest-category_content_text {
            white-space: pre-line;
            font-size: 13px;
            line-height: 1.45;
            color: white;
            margin: 0;
            word-break: break-word;
        }
    `;
    document.head.appendChild(style);
}

export function create_digest_element(data?: DigestData): HTMLElement {
    inject_digest_styles();

    const root = document.createElement("div");
    root.id = "smart-catch-up-digest-wrap";
    root.className = "scu-digest-container";

    if (data) {
        populate_digest_content(root, data);
    }

    return root;
}

export function populate_digest_content(root: HTMLElement, data: DigestData): void {
    root.innerHTML = "";

    const createdAt = data.created_at || Date.now().toString();
    const formattedDate = formatDigestCreationTime(createdAt);

    const header = document.createElement("div");
    header.className = "scu-digest-header";

    const title = document.createElement("h2");
    title.className = "scu-digest-title";
    title.textContent = "Дайджест";

    const dateP = document.createElement("p");
    dateP.className = "scu-digest-date";
    dateP.textContent = `Дата обновления: ${formattedDate}`;

    header.appendChild(title);
    header.appendChild(dateP);
    root.appendChild(header);

    const contentRoot = document.createElement("div");
    contentRoot.className = "scu-digest-content";

    const importantList = data.important ?? [];
    const categoriesList = [...(data.categories ?? [])];

    if (importantList.length === 0 && categoriesList.length === 0) {
        const empty = document.createElement("div");
        empty.className = "scu-digest-empty";
        empty.textContent = "Дайджест ещё не сформировался...";
        contentRoot.appendChild(empty);
        root.appendChild(contentRoot);
        return;
    }

    if (importantList.length > 0) {
        const contentLines: string[] = [];
        for (let i = 0; i < importantList.length; i++) {
            contentLines.push(importantList[i].notification);
        }
        const importantCard = create_digest_category_element({
            header: "Важное",
            content: contentLines.join("\n"),
        });
        contentRoot.appendChild(importantCard);
    }

    categoriesList.sort((a, b) => a.rank - b.rank);

    for (let i = 0; i < categoriesList.length; i++) {
        const category = categoriesList[i];
        let categoryHeader = translated_clusters.get(category.category_type);
        if (!categoryHeader) {
            categoryHeader = category.category_type;
        }
        const categoryCard = create_digest_category_element({
            header: categoryHeader,
            content: category.text,
        });
        contentRoot.appendChild(categoryCard);
    }

    root.appendChild(contentRoot);
}

export function set_digest_loading(root: HTMLElement): void {
    inject_digest_styles();
    root.innerHTML = `
        <div class="scu-digest-header">
            <h2 class="scu-digest-title">Дайджест</h2>
        </div>
        <div class="scu-digest-loading">Загрузка дайджеста...</div>
    `;
}

export function set_digest_error(root: HTMLElement, message?: string): void {
    inject_digest_styles();
    root.innerHTML = `
        <div class="scu-digest-header">
            <h2 class="scu-digest-title">Дайджест</h2>
        </div>
        <div class="scu-digest-error">${message || "Не удалось загрузить дайджест"}</div>
    `;
}

export class DigestComponent {
    private element: HTMLElement;

    constructor(data?: DigestData) {
        this.element = create_digest_element(data);
    }

    render(parent?: HTMLElement): HTMLElement {
        if (parent) {
            parent.appendChild(this.element);
        }
        return this.element;
    }

    update(data: DigestData): void {
        populate_digest_content(this.element, data);
    }

    showLoading(): void {
        set_digest_loading(this.element);
    }

    showError(message?: string): void {
        set_digest_error(this.element, message);
    }

    getElement(): HTMLElement {
        return this.element;
    }
}
