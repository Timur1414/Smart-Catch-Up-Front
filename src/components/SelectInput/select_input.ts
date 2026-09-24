import {BaseComponent} from "../base_component.ts";
import template from "./select_input.hbs?raw";
import "./select_input.css";

export interface SelectOption {
    value: string | number;
    label: string;
    isSelected?: boolean;
}

export interface SelectInputProps {
    name?: string;
    label?: string;
    placeholder?: string;
    options: (SelectOption | string)[];
    selectedValue?: string | number | null;
    disabled?: boolean;
    error?: string;
    onChange?: (value: string, option: SelectOption | null) => void;
}

export class SelectInput extends BaseComponent {
    private _value: string = "";
    private _isOpen: boolean = false;
    private _optionsList: SelectOption[] = [];
    private _placeholderText: string = "Выберите вариант";
    private _isDisabled: boolean = false;
    private _onChangeCallback?: (value: string, option: SelectOption | null) => void;
    private _onDocumentClick: ((event: MouseEvent) => void) | null = null;

    constructor(props: SelectInputProps) {
        const initialValue: string = props.selectedValue !== undefined && props.selectedValue !== null
            ? String(props.selectedValue)
            : "";

        const normalizedOptions: SelectOption[] = (props.options || []).map((opt) => {
            if (typeof opt === "string" || typeof opt === "number") {
                const str = String(opt);
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

        const selectedOption = normalizedOptions.find((opt) => opt.isSelected);
        const placeholder = props.placeholder || "Выберите вариант";

        super(template, {
            ...props,
            options: normalizedOptions,
            selectedValue: initialValue,
            selectedLabel: selectedOption ? selectedOption.label : "",
            placeholder,
        });

        this._value = initialValue;
        this._optionsList = normalizedOptions;
        this._placeholderText = placeholder;
        this._isDisabled = Boolean(props.disabled);
        this._onChangeCallback = props.onChange;
    }

    override _addEventListeners(): void {
        this._delegate("click", ".select-input_control", (event: Event) => {
            event.preventDefault();
            if (this._isDisabled) return;
            this.toggle();
        });

        this._delegate("click", ".select-input_option", (event: Event, target: HTMLElement) => {
            event.preventDefault();
            if (this._isDisabled) return;

            const selectedVal = target.getAttribute("data-value") ?? "";
            this.setValue(selectedVal);
            this.close();
        });

        this._delegate("keydown", ".select-input_control", (event: Event) => {
            if (this._isDisabled) return;
            const keyEvent = event as KeyboardEvent;

            if (keyEvent.key === "Enter" || keyEvent.key === " ") {
                keyEvent.preventDefault();
                this.toggle();
            } else if (keyEvent.key === "Escape") {
                keyEvent.preventDefault();
                this.close();
            } else if (keyEvent.key === "ArrowDown") {
                keyEvent.preventDefault();
                if (!this._isOpen) {
                    this.open();
                } else {
                    this._selectNextOption(1);
                }
            } else if (keyEvent.key === "ArrowUp") {
                keyEvent.preventDefault();
                if (!this._isOpen) {
                    this.open();
                } else {
                    this._selectNextOption(-1);
                }
            }
        });

        if (this._onDocumentClick) {
            document.removeEventListener("click", this._onDocumentClick);
        }

        this._onDocumentClick = (event: MouseEvent) => {
            const root = this.getElement();
            if (root && !root.contains(event.target as Node)) {
                this.close();
            }
        };

        document.addEventListener("click", this._onDocumentClick);
    }

    public open(): void {
        if (this._isDisabled || this._isOpen) return;

        this._isOpen = true;
        const root = this.getElement();
        if (root) {
            root.classList.add("is-open");
            const control = root.querySelector<HTMLElement>(".select-input_control");
            control?.setAttribute("aria-expanded", "true");
        }
    }

    public close(): void {
        if (!this._isOpen) return;

        this._isOpen = false;
        const root = this.getElement();
        if (root) {
            root.classList.remove("is-open");
            const control = root.querySelector<HTMLElement>(".select-input_control");
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
        return this._optionsList.find((opt) => String(opt.value) === this._value) ?? null;
    }

    public setValue(value: string | number | null): void {
        const strVal = value !== null && value !== undefined ? String(value) : "";
        this._value = strVal;

        const selectedOption = this._optionsList.find((opt) => String(opt.value) === strVal) ?? null;
        const root = this.getElement();

        if (root) {
            const textElement = root.querySelector<HTMLElement>(".select-input_selected_text");
            if (textElement) {
                if (selectedOption) {
                    textElement.textContent = selectedOption.label;
                    textElement.classList.remove("select-input_placeholder");
                } else {
                    textElement.textContent = this._placeholderText;
                    textElement.classList.add("select-input_placeholder");
                }
            }

            const hiddenInput = root.querySelector<HTMLInputElement>(".select-input_hidden");
            if (hiddenInput) {
                hiddenInput.value = this._value;
                hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));
                hiddenInput.dispatchEvent(new Event("input", { bubbles: true }));
            }

            const optionsElements = root.querySelectorAll<HTMLElement>(".select-input_option");
            optionsElements.forEach((el) => {
                const optVal = el.getAttribute("data-value");
                const isSelected = optVal === strVal;
                el.classList.toggle("select-input_option_selected", isSelected);
                el.setAttribute("aria-selected", isSelected ? "true" : "false");
            });
        }

        this._onChangeCallback?.(this._value, selectedOption);
    }

    public setDisabled(disabled: boolean): void {
        this._isDisabled = disabled;
        const root = this.getElement();
        if (root) {
            root.classList.toggle("select-input_disabled", disabled);
            const control = root.querySelector<HTMLElement>(".select-input_control");
            control?.setAttribute("tabindex", disabled ? "-1" : "0");
        }
        if (disabled) {
            this.close();
        }
    }

    public setOptions(options: (SelectOption | string)[], selectedValue?: string | number | null): void {
        const valToSelect = selectedValue !== undefined ? selectedValue : this._value;
        const initialValue = valToSelect !== null && valToSelect !== undefined ? String(valToSelect) : "";

        this._optionsList = options.map((opt) => {
            if (typeof opt === "string" || typeof opt === "number") {
                const str = String(opt);
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

        const selectedOption = this._optionsList.find((opt) => opt.isSelected);

        this.update({
            options: this._optionsList,
            selectedValue: initialValue,
            selectedLabel: selectedOption ? selectedOption.label : "",
        });

        this._value = initialValue;
    }

    private _selectNextOption(direction: 1 | -1): void {
        if (this._optionsList.length === 0) return;

        const currentIndex = this._optionsList.findIndex((opt) => String(opt.value) === this._value);
        let nextIndex = currentIndex + direction;

        if (nextIndex < 0) {
            nextIndex = this._optionsList.length - 1;
        } else if (nextIndex >= this._optionsList.length) {
            nextIndex = 0;
        }

        const nextOption = this._optionsList[nextIndex];
        if (nextOption) {
            this.setValue(nextOption.value);
        }
    }

    public override destroy(): void {
        if (this._onDocumentClick) {
            document.removeEventListener("click", this._onDocumentClick);
            this._onDocumentClick = null;
        }
        super.destroy();
    }
}
