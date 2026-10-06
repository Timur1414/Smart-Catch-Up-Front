import { BaseComponent } from "../base_component.ts";
import template from "./modal.hbs?raw";
import "./modal.css";
import {ModalProps} from "../../types/props_interfaces.ts";



export class Modal extends BaseComponent {
    private _onCloseCallback?: () => void;
    private _keydownHandler: ((event: KeyboardEvent) => void) | null = null;
    private _isClosing: boolean = false;

    constructor(messageOrProps: string | ModalProps = {}) {
        const props: ModalProps =
            typeof messageOrProps === "string"
                ? { message: messageOrProps }
                : { ...messageOrProps };

        const title: string = props.title ?? "Ошибка";
        const message: string = props.message ?? "";
        const buttonText: string = props.buttonText ?? "Понятно";

        super(template, {
            title,
            message,
            buttonText,
            ...props,
        });

        this._onCloseCallback = props.onClose;

        if (typeof document !== "undefined" && props.autoRender !== false) {
            const container: HTMLElement | null = props.container ?? document.body;
            if (container) {
                this.render(container);
            } else {
                window.addEventListener("DOMContentLoaded", () => {
                    this.render(props.container ?? document.body);
                }, { once: true });
            }
        }
    }

    override _addEventListeners(): void {
        const element: HTMLElement | null = this.getElement();
        if (!element) return;

        this._on(element, "click", (event: Event) => {
            if (event.target === element) {
                this.close();
            }
        });

        const closeIconBtn: HTMLElement | null = element.querySelector<HTMLElement>(".modal_close_btn");
        if (closeIconBtn) {
            this._on(closeIconBtn, "click", (event: Event) => {
                event.preventDefault();
                this.close();
            });
        }

        const actionBtn: HTMLElement | null = element.querySelector<HTMLElement>(".modal_action_btn");
        if (actionBtn) {
            this._on(actionBtn, "click", (event: Event) => {
                event.preventDefault();
                this.close();
            });
        }

        this._keydownHandler = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                this.close();
            }
        };
        window.addEventListener("keydown", this._keydownHandler);
    }

    public close(): void {
        if (this._isClosing) return;
        this._isClosing = true;

        const element: HTMLElement | null = this.getElement();
        if (element) {
            element.classList.add("modal_closing");
            setTimeout(() => {
                this._onCloseCallback?.();
                this.destroy();
            }, 200);
        } else {
            this._onCloseCallback?.();
            this.destroy();
        }
    }

    public open(container: HTMLElement = document.body): void {
        if (!this.getElement()) {
            this._isClosing = false;
            this.render(container);
        }
    }

    public override destroy(): void {
        if (this._keydownHandler) {
            window.removeEventListener("keydown", this._keydownHandler);
            this._keydownHandler = null;
        }
        super.destroy();
    }
}
