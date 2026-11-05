import {BaseComponent} from "../base_component.ts";
import template from "./select_input_with_search.hbs?raw";
import "./select_input_with_search.css";
import {SelectInputWithSearchProps, SelectOption} from "../../types/props_interfaces.ts";

export class SelectInputWithSearch extends BaseComponent {
    private _value: string = "";
    private _isOpen: boolean = false;
    private _optionsList: SelectOption[] = [];
    private _selectedOption: SelectOption | null = null;
    private readonly _placeholderText: string = "Выберите вариант";
    private readonly _loadingText: string = "Загрузка...";
    private readonly _noResultsText: string = "Ничего не найдено";
    private readonly _debounceMs: number = 1000;
    private _isDisabled: boolean = false;
    private readonly _onChangeCallback?: (value: string, option: SelectOption | null) => void;
    private readonly _fetchOptionsCallback?: (query: string) => Promise<(SelectOption | string | number)[]>;
    private _onDocumentClick: ((event: MouseEvent) => void) | null = null;
    private _debounceTimer: number | null = null;
    private _queryId: number = 0;
    private _highlightedIndex: number = -1;

    constructor(props: SelectInputWithSearchProps) {
        const initialValue: string = props.selectedValue !== undefined && props.selectedValue !== null
            ? String(props.selectedValue)
            : "";

        const normalizedOptions: SelectOption[] = (props.options || []).map((opt) => {
            if (typeof opt === "string" || typeof opt === "number") {
                const str: string = String(opt);
                return {
                    value: str,
                    label: str,
                    isSelected: str === initialValue,
                };
            }
            return {
                value: String(opt.value),
                label: opt.label,
                isSelected: String(opt.value) === initialValue,
            };
        });

        const selectedOption: SelectOption | undefined = normalizedOptions.find((opt) => opt.isSelected);
        const placeholder: string = props.placeholder || "Выберите вариант";
        const searchPlaceholder: string = props.searchPlaceholder || "Поиск...";

        super(template, {
            ...props,
            options: normalizedOptions,
            selectedValue: initialValue,
            selectedLabel: selectedOption ? selectedOption.label : "",
            placeholder,
            searchPlaceholder,
            statusText: "",
        });

        this._value = initialValue;
        this._optionsList = normalizedOptions;
        this._selectedOption = selectedOption ?? (initialValue ? { value: initialValue, label: initialValue, isSelected: true } : null);
        this._placeholderText = placeholder;
        this._loadingText = props.loadingText || "Загрузка...";
        this._noResultsText = props.noResultsText || "Ничего не найдено";
        this._debounceMs = props.debounceMs ?? 1000;
        this._isDisabled = Boolean(props.disabled);
        this._onChangeCallback = props.onChange;
        this._fetchOptionsCallback = props.fetchOptions;
    }

    override _addEventListeners(): void {
        this._delegate("click", ".select-input-with-search_control", (event: Event) => {
            event.preventDefault();
            if (this._isDisabled) return;
            this.toggle();
        });

        this._delegate("click", ".select-input-with-search_search_wrapper", (event: Event) => {
            event.stopPropagation();
        });

        this._delegate("input", ".select-input-with-search_search_input", (_event: Event, target: HTMLElement) => {
            if (this._isDisabled) return;
            const input = target as HTMLInputElement;
            this._handleSearchInput(input.value);
        });

        this._delegate("keydown", ".select-input-with-search_search_input", (event: Event) => {
            if (this._isDisabled) return;
            const keyEvent = event as KeyboardEvent;
            this._handleSearchKeydown(keyEvent);
        });

        this._delegate("click", ".select-input-with-search_option", (event: Event, target: HTMLElement) => {
            event.preventDefault();
            if (this._isDisabled) return;

            const selectedVal: string = target.getAttribute("data-value") ?? "";
            const selectedLabel: string = target.getAttribute("data-label") ?? selectedVal;
            this.setValue(selectedVal, selectedLabel);
            this.close();
        });

        this._delegate("keydown", ".select-input-with-search_control", (event: Event) => {
            if (this._isDisabled) return;
            const keyEvent = event as KeyboardEvent;

            if (keyEvent.key === "Enter" || keyEvent.key === " ") {
                keyEvent.preventDefault();
                this.toggle();
            } else if (keyEvent.key === "Escape") {
                keyEvent.preventDefault();
                this.close();
            }
        });

        if (this._onDocumentClick) {
            document.removeEventListener("click", this._onDocumentClick);
        }

        this._onDocumentClick = (event: MouseEvent) => {
            const root: HTMLElement | null = this.getElement();
            if (root && !root.contains(event.target as Node)) {
                this.close();
            }
        };

        document.addEventListener("click", this._onDocumentClick);
    }

    private _handleSearchInput(query: string): void {
        if (this._debounceTimer !== null) {
            window.clearTimeout(this._debounceTimer);
            this._debounceTimer = null;
        }

        const trimmed = query.trim();
        if (trimmed.length === 0) {
            this._setStatus("");
            this._optionsList = [];
            this._renderOptionsList([]);
            return;
        }

        this._debounceTimer = window.setTimeout(() => {
            this._performSearch(trimmed);
        }, this._debounceMs);
    }

    private async _performSearch(query: string): Promise<void> {
        if (!this._fetchOptionsCallback) {
            return;
        }

        const currentQueryId = ++this._queryId;
        this._setStatus(this._loadingText);
        this._renderOptionsList([]);

        try {
            const rawResults = await this._fetchOptionsCallback(query);
            if (this._queryId !== currentQueryId) {
                return;
            }

            const normalized: SelectOption[] = rawResults.map((opt) => {
                if (typeof opt === "string" || typeof opt === "number") {
                    const str: string = String(opt);
                    return {
                        value: str,
                        label: str,
                        isSelected: str === this._value,
                    };
                }
                return {
                    value: String(opt.value),
                    label: opt.label,
                    isSelected: String(opt.value) === this._value,
                };
            });

            this._optionsList = normalized;
            this._highlightedIndex = -1;

            if (normalized.length === 0) {
                this._setStatus(this._noResultsText);
                this._renderOptionsList([]);
            } else {
                this._setStatus("");
                this._renderOptionsList(normalized);
            }
        } catch (error) {
            if (this._queryId !== currentQueryId) {
                return;
            }
            console.error("SelectInputWithSearch search error:", error);
            this._setStatus("Ошибка при загрузке данных");
            this._renderOptionsList([]);
        }
    }

    private _handleSearchKeydown(event: KeyboardEvent): void {
        if (event.key === "Escape") {
            event.preventDefault();
            this.close();
            const root = this.getElement();
            root?.querySelector<HTMLElement>(".select-input-with-search_control")?.focus();
            return;
        }

        if (this._optionsList.length === 0) return;

        if (event.key === "ArrowDown") {
            event.preventDefault();
            this._highlightedIndex = (this._highlightedIndex + 1) % this._optionsList.length;
            this._updateHighlightedOption();
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            this._highlightedIndex = this._highlightedIndex <= 0
                ? this._optionsList.length - 1
                : this._highlightedIndex - 1;
            this._updateHighlightedOption();
        } else if (event.key === "Enter") {
            event.preventDefault();
            if (this._highlightedIndex >= 0 && this._highlightedIndex < this._optionsList.length) {
                const opt = this._optionsList[this._highlightedIndex];
                this.setValue(opt.value, opt.label);
                this.close();
                const root = this.getElement();
                root?.querySelector<HTMLElement>(".select-input-with-search_control")?.focus();
            }
        }
    }

    private _updateHighlightedOption(): void {
        const root = this.getElement();
        if (!root) return;

        const optionsElements = root.querySelectorAll<HTMLElement>(".select-input-with-search_option");
        optionsElements.forEach((el, index) => {
            const isHighlighted = index === this._highlightedIndex;
            el.classList.toggle("select-input-with-search_option_highlighted", isHighlighted);
            if (isHighlighted) {
                el.scrollIntoView({ block: "nearest" });
            }
        });
    }

    private _renderOptionsList(options: SelectOption[]): void {
        const root = this.getElement();
        if (!root) return;

        const list = root.querySelector<HTMLUListElement>(".select-input-with-search_options_list");
        if (!list) return;

        if (options.length === 0) {
            list.innerHTML = "";
            return;
        }

        list.innerHTML = options.map((opt) => {
            const isSelected = String(opt.value) === this._value;
            const selectedClass = isSelected ? " select-input-with-search_option_selected" : "";
            const ariaSelected = isSelected ? "true" : "false";
            return `<li class="select-input-with-search_option${selectedClass}" 
                        data-value="${this._escapeHtml(String(opt.value))}" 
                        data-label="${this._escapeHtml(opt.label)}"
                        role="option"
                        aria-selected="${ariaSelected}">
                        ${this._escapeHtml(opt.label)}
                    </li>`;
        }).join("");
    }

    private _setStatus(text: string): void {
        const root = this.getElement();
        if (!root) return;

        const statusEl = root.querySelector<HTMLElement>(".select-input-with-search_status");
        if (!statusEl) return;

        if (!text) {
            statusEl.textContent = "";
            statusEl.classList.add("is-hidden");
        } else {
            statusEl.textContent = text;
            statusEl.classList.remove("is-hidden");
        }
    }

    public open(): void {
        if (this._isDisabled || this._isOpen) return;

        this._isOpen = true;
        const root: HTMLElement | null = this.getElement();
        if (root) {
            root.classList.add("is-open");
            const control: HTMLElement | null = root.querySelector<HTMLElement>(".select-input-with-search_control");
            control?.setAttribute("aria-expanded", "true");

            const searchInput = root.querySelector<HTMLInputElement>(".select-input-with-search_search_input");
            if (searchInput) {
                setTimeout(() => searchInput.focus(), 30);
            }
        }
    }

    public close(): void {
        if (!this._isOpen) return;

        this._isOpen = false;
        const root: HTMLElement | null = this.getElement();
        if (root) {
            root.classList.remove("is-open");
            const control: HTMLElement | null = root.querySelector<HTMLElement>(".select-input-with-search_control");
            control?.setAttribute("aria-expanded", "false");
        }
    }

    public toggle(): void {
        if (this._isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    public getValue(): string {
        return this._value;
    }

    public getSelectedOption(): SelectOption | null {
        return this._selectedOption;
    }

    public setValue(value: string | number | null, label?: string): void {
        const strVal: string = value !== null && value !== undefined ? String(value) : "";
        this._value = strVal;

        let selectedOption: SelectOption | null = this._optionsList.find((opt) => String(opt.value) === strVal) ?? null;
        if (!selectedOption && strVal) {
            selectedOption = {
                value: strVal,
                label: label || (this._selectedOption ? this._selectedOption.label : strVal),
                isSelected: true,
            };
        } else if (!strVal) {
            selectedOption = null;
        }

        this._selectedOption = selectedOption;
        const root: HTMLElement | null = this.getElement();

        if (root) {
            const textElement: HTMLElement | null = root.querySelector<HTMLElement>(".select-input-with-search_selected_text");
            if (textElement) {
                if (selectedOption) {
                    textElement.textContent = selectedOption.label;
                    textElement.classList.remove("select-input-with-search_placeholder");
                } else {
                    textElement.textContent = this._placeholderText;
                    textElement.classList.add("select-input-with-search_placeholder");
                }
            }

            const hiddenInput: HTMLInputElement | null = root.querySelector<HTMLInputElement>(".select-input-with-search_hidden");
            if (hiddenInput) {
                hiddenInput.value = this._value;
                hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));
                hiddenInput.dispatchEvent(new Event("input", { bubbles: true }));
            }

            const optionsElements: NodeListOf<HTMLElement> = root.querySelectorAll<HTMLElement>(".select-input-with-search_option");
            optionsElements.forEach((el: HTMLElement) => {
                const optVal: string | null = el.getAttribute("data-value");
                const isSelected: boolean = optVal === strVal;
                el.classList.toggle("select-input-with-search_option_selected", isSelected);
                el.setAttribute("aria-selected", isSelected ? "true" : "false");
            });
        }

        this._onChangeCallback?.(this._value, selectedOption);
    }

    public setDisabled(disabled: boolean): void {
        this._isDisabled = disabled;
        const root: HTMLElement | null = this.getElement();
        if (root) {
            root.classList.toggle("select-input-with-search_disabled", disabled);
            const control: HTMLElement | null = root.querySelector<HTMLElement>(".select-input-with-search_control");
            control?.setAttribute("tabindex", disabled ? "-1" : "0");
        }
        if (disabled) {
            this.close();
        }
    }

    public setOptions(options: (SelectOption | string | number)[], selectedValue?: string | number | null): void {
        const valToSelect: string | number | null = selectedValue !== undefined ? selectedValue : this._value;
        const initialValue: string = valToSelect !== null && valToSelect !== undefined ? String(valToSelect) : "";

        this._optionsList = options.map((opt) => {
            if (typeof opt === "string" || typeof opt === "number") {
                const str: string = String(opt);
                return {
                    value: str,
                    label: str,
                    isSelected: str === initialValue,
                };
            }
            return {
                value: String(opt.value),
                label: opt.label,
                isSelected: String(opt.value) === initialValue,
            };
        });

        const selectedOption: SelectOption | undefined = this._optionsList.find((opt) => opt.isSelected);
        this._value = initialValue;
        if (selectedOption) {
            this._selectedOption = selectedOption;
        }

        this._renderOptionsList(this._optionsList);
        this.setValue(this._value, this._selectedOption ? this._selectedOption.label : undefined);
    }

    private _escapeHtml(text: string): string {
        const div: HTMLDivElement = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    public override destroy(): void {
        if (this._debounceTimer !== null) {
            window.clearTimeout(this._debounceTimer);
            this._debounceTimer = null;
        }
        if (this._onDocumentClick) {
            document.removeEventListener("click", this._onDocumentClick);
            this._onDocumentClick = null;
        }
        super.destroy();
    }
}
