import {BaseComponent} from "../base_component.ts";
import template from "./multi_select_input.hbs?raw";
import "./multi_select_input.css";

export interface MultiSelectOption {
    value: string | number;
    label: string;
    isSelected?: boolean;
}

export interface MultiSelectInputProps {
    name?: string;
    label?: string;
    placeholder?: string;
    options: (MultiSelectOption | string)[];
    selectedValues?: (string | number)[] | null;
    disabled?: boolean;
    error?: string;
    onChange?: (values: string[], options: MultiSelectOption[]) => void;
}

export class MultiSelectInput extends BaseComponent {
    private _selectedValues: Set<string> = new Set();
    private _isOpen: boolean = false;
    private _optionsList: MultiSelectOption[] = [];
    private readonly _placeholderText: string = "Выберите варианты";
    private _isDisabled: boolean = false;
    private readonly _onChangeCallback?: (values: string[], options: MultiSelectOption[]) => void;
    private _onDocumentClick: ((event: MouseEvent) => void) | null = null;

    constructor(props: MultiSelectInputProps) {
        const initialValues = new Set<string>(
            (props.selectedValues || []).map((val: string | number): string => String(val))
        );

        const normalizedOptions: MultiSelectOption[] = (props.options || []).map((opt: string | MultiSelectOption) => {
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

        const selectedItems: MultiSelectOption[] = normalizedOptions.filter((opt: MultiSelectOption): boolean => initialValues.has(String(opt.value)));
        const placeholder: string = props.placeholder || "Выберите варианты";

        super(template, {
            ...props,
            options: normalizedOptions,
            selectedItems,
            selectedValuesString: Array.from(initialValues).join(","),
            placeholder,
        });

        this._selectedValues = initialValues;
        this._optionsList = normalizedOptions;
        this._placeholderText = placeholder;
        this._isDisabled = Boolean(props.disabled);
        this._onChangeCallback = props.onChange;
    }

    override _addEventListeners(): void {
        this._delegate("click", ".multi-select-input_tag_remove", (event: Event, target: HTMLElement) => {
            event.preventDefault();
            event.stopPropagation();
            if (this._isDisabled) return;
            const val: string | null = target.getAttribute("data-value");
            if (val !== null) {
                this.deselectValue(val);
            }
        });

        this._delegate("click", ".multi-select-input_control", (event: Event) => {
            const target = event.target as HTMLElement;
            if (target.closest(".multi-select-input_tag_remove")) {
                return;
            }
            event.preventDefault();
            if (this._isDisabled) return;
            this.toggle();
        });

        this._delegate("click", ".multi-select-input_option", (event: Event, target: HTMLElement) => {
            event.preventDefault();
            if (this._isDisabled) return;

            const selectedVal: string = target.getAttribute("data-value") ?? "";
            this.toggleValue(selectedVal);
        });

        this._delegate("keydown", ".multi-select-input_control", (event: Event) => {
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

    public open(): void {
        if (this._isDisabled || this._isOpen) return;

        this._isOpen = true;
        const root: HTMLElement | null = this.getElement();
        if (root) {
            root.classList.add("is-open");
            const control: HTMLElement | null = root.querySelector<HTMLElement>(".multi-select-input_control");
            control?.setAttribute("aria-expanded", "true");
        }
    }

    public close(): void {
        if (!this._isOpen) return;

        this._isOpen = false;
        const root: HTMLElement | null = this.getElement();
        if (root) {
            root.classList.remove("is-open");
            const control: HTMLElement | null = root.querySelector<HTMLElement>(".multi-select-input_control");
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
        return this._optionsList.filter((opt: MultiSelectOption): boolean => this._selectedValues.has(String(opt.value)));
    }

    public setValues(values: (string | number)[]): void {
        this._selectedValues = new Set((values || []).map((v: string | number): string => String(v)));
        this._updateOptionSelections();
        this._updateControlUI();
        this._onChangeCallback?.(this.getValues(), this.getSelectedOptions());
    }

    public setValue(values: (string | number)[]): void {
        this.setValues(values);
    }

    public toggleValue(value: string | number): void {
        const strVal: string = String(value);
        if (this._selectedValues.has(strVal)) {
            this._selectedValues.delete(strVal);
        } else {
            this._selectedValues.add(strVal);
        }
        this._updateOptionSelections();
        this._updateControlUI();
        this._onChangeCallback?.(this.getValues(), this.getSelectedOptions());
    }

    public selectValue(value: string | number): void {
        const strVal: string = String(value);
        if (!this._selectedValues.has(strVal)) {
            this._selectedValues.add(strVal);
            this._updateOptionSelections();
            this._updateControlUI();
            this._onChangeCallback?.(this.getValues(), this.getSelectedOptions());
        }
    }

    public deselectValue(value: string | number): void {
        const strVal: string = String(value);
        if (this._selectedValues.has(strVal)) {
            this._selectedValues.delete(strVal);
            this._updateOptionSelections();
            this._updateControlUI();
            this._onChangeCallback?.(this.getValues(), this.getSelectedOptions());
        }
    }

    public clear(): void {
        if (this._selectedValues.size > 0) {
            this._selectedValues.clear();
            this._updateOptionSelections();
            this._updateControlUI();
            this._onChangeCallback?.(this.getValues(), this.getSelectedOptions());
        }
    }

    public setDisabled(disabled: boolean): void {
        this._isDisabled = disabled;
        const root: HTMLElement | null = this.getElement();
        if (root) {
            root.classList.toggle("multi-select-input_disabled", disabled);
            const control: HTMLElement | null = root.querySelector<HTMLElement>(".multi-select-input_control");
            control?.setAttribute("tabindex", disabled ? "-1" : "0");
        }
        if (disabled) {
            this.close();
        }
    }

    public setOptions(options: (MultiSelectOption | string)[], selectedValues?: (string | number)[] | null): void {
        if (selectedValues !== undefined && selectedValues !== null) {
            this._selectedValues = new Set(selectedValues.map((v: string | number): string => String(v)));
        }

        this._optionsList = options.map((opt: string | MultiSelectOption) => {
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

        const selectedItems: MultiSelectOption[] = this._optionsList.filter((opt: MultiSelectOption): boolean => this._selectedValues.has(String(opt.value)));

        this.update({
            options: this._optionsList,
            selectedItems,
            selectedValuesString: Array.from(this._selectedValues).join(","),
        });
    }

    private _updateOptionSelections(): void {
        this._optionsList.forEach((opt: MultiSelectOption): void => {
            opt.isSelected = this._selectedValues.has(String(opt.value));
        });
    }

    private _updateControlUI(): void {
        const root: HTMLElement | null = this.getElement();
        if (!root) return;

        const valuesWrapper: HTMLElement | null = root.querySelector<HTMLElement>(".multi-select-input_values_wrapper");
        if (valuesWrapper) {
            const selectedOptions: MultiSelectOption[] = this.getSelectedOptions();
            if (selectedOptions.length === 0) {
                valuesWrapper.innerHTML = `<span class="multi-select-input_placeholder">${this._escapeHtml(this._placeholderText)}</span>`;
            } else {
                valuesWrapper.innerHTML = selectedOptions
                    .map(
                        (opt: MultiSelectOption): string =>
                            `<span class="multi-select-input_tag" data-value="${this._escapeHtml(String(opt.value))}"><span class="multi-select-input_tag_label">${this._escapeHtml(opt.label)}</span><button type="button" class="multi-select-input_tag_remove" data-value="${this._escapeHtml(String(opt.value))}" aria-label="Удалить ${this._escapeHtml(opt.label)}" tabindex="-1">&times;</button></span>`
                    )
                    .join("");
            }
        }

        const hiddenInput: HTMLInputElement | null = root.querySelector<HTMLInputElement>(".multi-select-input_hidden");
        if (hiddenInput) {
            hiddenInput.value = this.getValues().join(",");
            hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));
            hiddenInput.dispatchEvent(new Event("input", { bubbles: true }));
        }

        const optionsElements: NodeListOf<HTMLElement> = root.querySelectorAll<HTMLElement>(".multi-select-input_option");
        optionsElements.forEach((el: HTMLElement): void => {
            const optVal: string = el.getAttribute("data-value") ?? "";
            const isSelected: boolean = this._selectedValues.has(optVal);
            el.classList.toggle("multi-select-input_option_selected", isSelected);
            el.setAttribute("aria-selected", isSelected ? "true" : "false");
        });
    }

    private _escapeHtml(text: string): string {
        const div: HTMLDivElement = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    public override destroy(): void {
        if (this._onDocumentClick) {
            document.removeEventListener("click", this._onDocumentClick);
            this._onDocumentClick = null;
        }
        super.destroy();
    }
}
