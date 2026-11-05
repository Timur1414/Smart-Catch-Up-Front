import {BaseComponent} from "../base_component.ts";
import template from "./multi_select_input_with_search.hbs?raw";
import "./multi_select_input_with_search.css";
import {MultiSelectInputWithSearchProps, MultiSelectOption} from "../../types/props_interfaces.ts";

export class MultiSelectInputWithSearch extends BaseComponent {
    private _selectedValues: Set<string> = new Set();
    private _selectedOptionsMap: Map<string, MultiSelectOption> = new Map();
    private _isOpen: boolean = false;
    private _optionsList: MultiSelectOption[] = [];
    private readonly _placeholderText: string = "Выберите варианты";
    private readonly _loadingText: string = "Загрузка...";
    private readonly _noResultsText: string = "Ничего не найдено";
    private readonly _debounceMs: number = 1000;
    private _isDisabled: boolean = false;
    private readonly _onChangeCallback?: (values: string[], options: MultiSelectOption[]) => void;
    private readonly _fetchOptionsCallback?: (query: string) => Promise<(MultiSelectOption | string | number)[]>;
    private _onDocumentClick: ((event: MouseEvent) => void) | null = null;
    private _debounceTimer: number | null = null;
    private _queryId: number = 0;

    constructor(props: MultiSelectInputWithSearchProps) {
        const initialValues = new Set<string>(
            (props.selectedValues || []).map((val: string | number): string => String(val))
        );

        const normalizedOptions: MultiSelectOption[] = (props.options || []).map((opt: string | number | MultiSelectOption) => {
            if (typeof opt === "string" || typeof opt === "number") {
                const str: string = String(opt);
                return {
                    value: str,
                    label: str,
                    isSelected: initialValues.has(str),
                };
            }
            const strVal: string = String(opt.value);
            return {
                value: strVal,
                label: opt.label,
                isSelected: initialValues.has(strVal),
            };
        });

        const selectedItems: MultiSelectOption[] = normalizedOptions.filter((opt: MultiSelectOption): boolean =>
            initialValues.has(String(opt.value))
        );

        const initialOptionsMap = new Map<string, MultiSelectOption>();
        for (const item of selectedItems) {
            initialOptionsMap.set(String(item.value), item);
        }
        for (const val of initialValues) {
            if (!initialOptionsMap.has(val)) {
                initialOptionsMap.set(val, { value: val, label: val, isSelected: true });
            }
        }

        const placeholder: string = props.placeholder || "Выберите варианты";
        const searchPlaceholder: string = props.searchPlaceholder || "Поиск...";

        super(template, {
            ...props,
            options: normalizedOptions,
            selectedItems: Array.from(initialOptionsMap.values()),
            selectedValuesString: Array.from(initialValues).join(","),
            placeholder,
            searchPlaceholder,
            statusText: "",
        });

        this._selectedValues = initialValues;
        this._selectedOptionsMap = initialOptionsMap;
        this._optionsList = normalizedOptions;
        this._placeholderText = placeholder;
        this._loadingText = props.loadingText || "Загрузка...";
        this._noResultsText = props.noResultsText || "Ничего не найдено";
        this._debounceMs = props.debounceMs ?? 1000;
        this._isDisabled = Boolean(props.disabled);
        this._onChangeCallback = props.onChange;
        this._fetchOptionsCallback = props.fetchOptions;
    }

    override _addEventListeners(): void {
        this._delegate("click", ".multi-select-input-with-search_tag_remove", (event: Event, target: HTMLElement) => {
            event.preventDefault();
            event.stopPropagation();
            if (this._isDisabled) return;
            const val: string | null = target.getAttribute("data-value");
            if (val !== null) {
                this.deselectValue(val);
            }
        });

        this._delegate("click", ".multi-select-input-with-search_control", (event: Event) => {
            const target = event.target as HTMLElement;
            if (target.closest(".multi-select-input-with-search_tag_remove")) {
                return;
            }
            event.preventDefault();
            if (this._isDisabled) return;
            this.toggle();
        });

        this._delegate("click", ".multi-select-input-with-search_search_wrapper", (event: Event) => {
            event.stopPropagation();
        });

        this._delegate("input", ".multi-select-input-with-search_search_input", (_event: Event, target: HTMLElement) => {
            if (this._isDisabled) return;
            const input = target as HTMLInputElement;
            this._handleSearchInput(input.value);
        });

        this._delegate("keydown", ".multi-select-input-with-search_search_input", (event: Event) => {
            if (this._isDisabled) return;
            const keyEvent = event as KeyboardEvent;
            if (keyEvent.key === "Escape") {
                event.preventDefault();
                this.close();
                const root = this.getElement();
                root?.querySelector<HTMLElement>(".multi-select-input-with-search_control")?.focus();
            }
        });

        this._delegate("click", ".multi-select-input-with-search_option", (event: Event, target: HTMLElement) => {
            event.preventDefault();
            if (this._isDisabled) return;

            const selectedVal: string = target.getAttribute("data-value") ?? "";
            const selectedLabel: string = target.getAttribute("data-label") ?? selectedVal;
            const opt: MultiSelectOption = {
                value: selectedVal,
                label: selectedLabel,
                isSelected: !this._selectedValues.has(selectedVal),
            };
            this.toggleValue(selectedVal, opt);
        });

        this._delegate("keydown", ".multi-select-input-with-search_control", (event: Event) => {
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

            const normalized: MultiSelectOption[] = rawResults.map((opt) => {
                if (typeof opt === "string" || typeof opt === "number") {
                    const str: string = String(opt);
                    return {
                        value: str,
                        label: str,
                        isSelected: this._selectedValues.has(str),
                    };
                }
                const strVal: string = String(opt.value);
                return {
                    value: strVal,
                    label: opt.label,
                    isSelected: this._selectedValues.has(strVal),
                };
            });

            this._optionsList = normalized;

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
            console.error("MultiSelectInputWithSearch search error:", error);
            this._setStatus("Ошибка при загрузке данных");
            this._renderOptionsList([]);
        }
    }

    private _renderOptionsList(options: MultiSelectOption[]): void {
        const root = this.getElement();
        if (!root) return;

        const list = root.querySelector<HTMLUListElement>(".multi-select-input-with-search_options_list");
        if (!list) return;

        if (options.length === 0) {
            list.innerHTML = "";
            return;
        }

        list.innerHTML = options.map((opt) => {
            const isSelected = this._selectedValues.has(String(opt.value));
            const selectedClass = isSelected ? " multi-select-input-with-search_option_selected" : "";
            const ariaSelected = isSelected ? "true" : "false";
            return `<li class="multi-select-input-with-search_option${selectedClass}" 
                        data-value="${this._escapeHtml(String(opt.value))}" 
                        data-label="${this._escapeHtml(opt.label)}"
                        role="option"
                        aria-selected="${ariaSelected}">
                        <span class="multi-select-input-with-search_checkbox">
                            <svg class="multi-select-input-with-search_checkmark" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M13.485 3.515a1.2 1.2 0 0 1 0 1.697l-6.364 6.364a1.2 1.2 0 0 1-1.697 0L2.515 8.667a1.2 1.2 0 1 1 1.697-1.697l2.06 2.06 5.516-5.515a1.2 1.2 0 0 1 1.697 0z"/>
                            </svg>
                        </span>
                        <span class="multi-select-input-with-search_option_text">${this._escapeHtml(opt.label)}</span>
                    </li>`;
        }).join("");
    }

    private _setStatus(text: string): void {
        const root = this.getElement();
        if (!root) return;

        const statusEl = root.querySelector<HTMLElement>(".multi-select-input-with-search_status");
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
            const control: HTMLElement | null = root.querySelector<HTMLElement>(".multi-select-input-with-search_control");
            control?.setAttribute("aria-expanded", "true");

            const searchInput = root.querySelector<HTMLInputElement>(".multi-select-input-with-search_search_input");
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
            const control: HTMLElement | null = root.querySelector<HTMLElement>(".multi-select-input-with-search_control");
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

    public getValues(): string[] {
        return Array.from(this._selectedValues);
    }

    public getValue(): string[] {
        return this.getValues();
    }

    public getSelectedOptions(): MultiSelectOption[] {
        return Array.from(this._selectedOptionsMap.values());
    }

    public setValues(values: (string | number)[], options?: MultiSelectOption[]): void {
        this._selectedValues = new Set((values || []).map((v: string | number): string => String(v)));
        this._selectedOptionsMap.clear();

        if (options) {
            for (const opt of options) {
                const str = String(opt.value);
                if (this._selectedValues.has(str)) {
                    this._selectedOptionsMap.set(str, opt);
                }
            }
        }
        for (const val of this._selectedValues) {
            if (!this._selectedOptionsMap.has(val)) {
                const fromList = this._optionsList.find((opt) => String(opt.value) === val);
                if (fromList) {
                    this._selectedOptionsMap.set(val, fromList);
                } else {
                    this._selectedOptionsMap.set(val, { value: val, label: val, isSelected: true });
                }
            }
        }

        this._updateOptionSelections();
        this._updateControlUI();
        this._onChangeCallback?.(this.getValues(), this.getSelectedOptions());
    }

    public setValue(values: (string | number)[]): void {
        this.setValues(values);
    }

    public toggleValue(value: string | number, option?: MultiSelectOption): void {
        const strVal: string = String(value);
        if (this._selectedValues.has(strVal)) {
            this.deselectValue(strVal);
        } else {
            this.selectValue(strVal, option);
        }
    }

    public selectValue(value: string | number, option?: MultiSelectOption): void {
        const strVal: string = String(value);
        if (!this._selectedValues.has(strVal)) {
            this._selectedValues.add(strVal);
            const foundOpt = option || this._optionsList.find((opt) => String(opt.value) === strVal) || {
                value: strVal,
                label: strVal,
                isSelected: true,
            };
            this._selectedOptionsMap.set(strVal, {
                value: strVal,
                label: foundOpt.label,
                isSelected: true,
            });
            this._updateOptionSelections();
            this._updateControlUI();
            this._onChangeCallback?.(this.getValues(), this.getSelectedOptions());
        }
    }

    public deselectValue(value: string | number): void {
        const strVal: string = String(value);
        if (this._selectedValues.has(strVal)) {
            this._selectedValues.delete(strVal);
            this._selectedOptionsMap.delete(strVal);
            this._updateOptionSelections();
            this._updateControlUI();
            this._onChangeCallback?.(this.getValues(), this.getSelectedOptions());
        }
    }

    public clear(): void {
        if (this._selectedValues.size > 0) {
            this._selectedValues.clear();
            this._selectedOptionsMap.clear();
            this._updateOptionSelections();
            this._updateControlUI();
            this._onChangeCallback?.(this.getValues(), this.getSelectedOptions());
        }
    }

    public setDisabled(disabled: boolean): void {
        this._isDisabled = disabled;
        const root: HTMLElement | null = this.getElement();
        if (root) {
            root.classList.toggle("multi-select-input-with-search_disabled", disabled);
            const control: HTMLElement | null = root.querySelector<HTMLElement>(".multi-select-input-with-search_control");
            control?.setAttribute("tabindex", disabled ? "-1" : "0");
        }
        if (disabled) {
            this.close();
        }
    }

    public setOptions(options: (MultiSelectOption | string | number)[], selectedValues?: (string | number)[] | null): void {
        if (selectedValues !== undefined && selectedValues !== null) {
            this._selectedValues = new Set(selectedValues.map((v) => String(v)));
        }

        this._optionsList = options.map((opt) => {
            if (typeof opt === "string" || typeof opt === "number") {
                const str: string = String(opt);
                return {
                    value: str,
                    label: str,
                    isSelected: this._selectedValues.has(str),
                };
            }
            const strVal: string = String(opt.value);
            return {
                value: strVal,
                label: opt.label,
                isSelected: this._selectedValues.has(strVal),
            };
        });

        this._renderOptionsList(this._optionsList);
        this._updateControlUI();
    }

    private _updateOptionSelections(): void {
        const root = this.getElement();
        if (!root) return;

        const optionsElements: NodeListOf<HTMLElement> = root.querySelectorAll<HTMLElement>(".multi-select-input-with-search_option");
        optionsElements.forEach((el: HTMLElement): void => {
            const optVal: string = el.getAttribute("data-value") ?? "";
            const isSelected: boolean = this._selectedValues.has(optVal);
            el.classList.toggle("multi-select-input-with-search_option_selected", isSelected);
            el.setAttribute("aria-selected", isSelected ? "true" : "false");
        });
    }

    private _updateControlUI(): void {
        const root: HTMLElement | null = this.getElement();
        if (!root) return;

        const valuesWrapper: HTMLElement | null = root.querySelector<HTMLElement>(".multi-select-input-with-search_values_wrapper");
        if (valuesWrapper) {
            const selectedOptions: MultiSelectOption[] = this.getSelectedOptions();
            if (selectedOptions.length === 0) {
                valuesWrapper.innerHTML = `<span class="multi-select-input-with-search_placeholder">${this._escapeHtml(this._placeholderText)}</span>`;
            } else {
                valuesWrapper.innerHTML = selectedOptions
                    .map(
                        (opt: MultiSelectOption): string =>
                            `<span class="multi-select-input-with-search_tag" data-value="${this._escapeHtml(String(opt.value))}"><span class="multi-select-input-with-search_tag_label">${this._escapeHtml(opt.label)}</span><button type="button" class="multi-select-input-with-search_tag_remove" data-value="${this._escapeHtml(String(opt.value))}" aria-label="Удалить ${this._escapeHtml(opt.label)}" tabindex="-1">&times;</button></span>`
                    )
                    .join("");
            }
        }

        const hiddenInput: HTMLInputElement | null = root.querySelector<HTMLInputElement>(".multi-select-input-with-search_hidden");
        if (hiddenInput) {
            hiddenInput.value = this.getValues().join(",");
            hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));
            hiddenInput.dispatchEvent(new Event("input", { bubbles: true }));
        }
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
