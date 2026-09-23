import {BaseComponent} from "../base_component.ts";
import template from "./login_form.hbs?raw";
import "./login_form.css";

export class LoginForm extends BaseComponent {
    constructor(props: any) {
        super(template, props);
    }

    _addEventListeners() {
        this._delegate("click", ".login-form_eye", (event: Event, target: HTMLElement) => {
            event.preventDefault();
            const eye_img = target as HTMLImageElement;
            const password_input: HTMLInputElement | null | undefined = this.getElement()?.querySelector<HTMLInputElement>("input[name='password']");
            if (!password_input)
                return;
            const is_password: boolean = password_input.type === "password";
            password_input.type = is_password ? "text" : "password";
            eye_img.src = is_password ? "/icons/closed_eye.png" : "/icons/eye.png";
        });
    }
}
