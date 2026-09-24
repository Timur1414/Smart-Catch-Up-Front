import {BaseComponent} from "../base_component.ts";
import template from "./register_form.hbs?raw";
import "./register_form.css";

export class RegisterForm extends BaseComponent {
    constructor(props: any) {
        super(template, props);
    }

    _addEventListeners() {
        this._delegate("click", ".register-form_eye", (event: Event, target: HTMLElement) => {
            event.preventDefault();
            event.preventDefault();
            this.toggle_eye(target, "#register-form_password_input");
        });

        this._delegate("click", ".register-form_eye2", (event: Event, target: HTMLElement) => {
            event.preventDefault();
            this.toggle_eye(target, "#register-form_password2_input");
        });
    }

    toggle_eye(target: HTMLElement, selector: string) {
        const eye_img = target as HTMLImageElement;
        const password_input: HTMLInputElement | null | undefined = this.getElement()?.querySelector<HTMLInputElement>(selector);
        if (!password_input)
            return;
        const is_password: boolean = password_input.type === "password";
        password_input.type = is_password ? "text" : "password";
        eye_img.src = is_password ? "/icons/closed_eye.png" : "/icons/eye.png";
    }
}
