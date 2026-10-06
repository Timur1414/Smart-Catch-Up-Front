import {BaseComponent} from "../base_component.ts";
import template from "./login_form.hbs?raw";
import "./login_form.css";
import {login} from "../../api/auth.ts";
import {router} from "../../main.ts";

export class LoginForm extends BaseComponent {
    constructor(props: any) {
        super(template, props);
    }

    _addEventListeners() {
        const eye_btn: HTMLImageElement | null | undefined = this.getElement()?.querySelector<HTMLImageElement>(".login-form_eye");
        if (!eye_btn)
            return;
        this._on(eye_btn, "click", (event: Event) => {
            event.preventDefault();
            const password_input: HTMLInputElement | null | undefined = this.getElement()?.querySelector<HTMLInputElement>("input[name='password']");
            if (!password_input)
                return;
            const is_password: boolean = password_input.type === "password";
            password_input.type = is_password ? "text" : "password";
            eye_btn.src = is_password ? "/icons/closed_eye.png" : "/icons/eye.png";
        });

        const send_btn: HTMLElement | null | undefined = this.getElement()?.querySelector<HTMLElement>(".login_btn");
        if (!send_btn)
            return;
        this._on(send_btn, "click", this.send_data);
    }

    async send_data(e: Event) {
        e.preventDefault();
        const email_input: HTMLInputElement | null | undefined = this.getElement()?.querySelector<HTMLInputElement>("#login-form_email_input");
        if (!email_input)
            return;
        const password_input: HTMLInputElement | null | undefined = this.getElement()?.querySelector<HTMLInputElement>("#login-form_password_input");
        if (!password_input)
            return;
        const email_value: string = email_input.value.trim().toLowerCase();
        const password_value: string = password_input.value.trim();
        const response = await login(email_value, password_value);
        if (!response.success) {
            const password_error_elem: HTMLElement | null | undefined = this.getElement()?.querySelector<HTMLElement>("#login-form_password_error");
            if (!password_error_elem)
                return false;
            password_error_elem.innerText = response.data.message;
            return;
        }
        router.navigate("/");
    }
}
