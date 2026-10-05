import {BaseComponent} from "../base_component.ts";
import template from "./register_form.hbs?raw";
import "./register_form.css";

export class RegisterForm extends BaseComponent {
    constructor(props: any) {
        super(template, props);
    }

    _addEventListeners() {
        const elem: HTMLElement | null = this.getElement();
        if (!elem)
            return;
        const eye1: HTMLImageElement | null = elem.querySelector<HTMLImageElement>(".register-form_eye");
        if (!eye1)
            return;
        const eye2: HTMLImageElement | null = elem.querySelector<HTMLImageElement>(".register-form_eye2");
        if (!eye2)
            return;
        this._on(eye1, "click", (event: Event) => {
            event.preventDefault();
            this.toggle_eye(eye1, "#register-form_password_input");
        });
        this._on(eye2, "click", (event: Event) => {
            event.preventDefault();
            this.toggle_eye(eye2, "#register-form_password2_input");
        });

        const send_btn: HTMLElement | null = elem.querySelector<HTMLElement>(".register_btn");
        if (!send_btn)
            return;
        this._on(send_btn, "click", this.send_data);
    }

    toggle_eye(eye_img: HTMLImageElement, selector: string) {
        const password_input: HTMLInputElement | null | undefined = this.getElement()?.querySelector<HTMLInputElement>(selector);
        if (!password_input)
            return;
        const is_password: boolean = password_input.type === "password";
        password_input.type = is_password ? "text" : "password";
        eye_img.src = is_password ? "/icons/closed_eye.png" : "/icons/eye.png";
    }

    async send_data(e: Event) {
        console.log('click');
    }
}
