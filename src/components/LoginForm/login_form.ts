import {BaseComponent} from "../base_component.ts";
import template from "./login_form.hbs?raw";
import "./login_form.css";
import {validate_email} from "../../utils/validators.ts";

export class LoginForm extends BaseComponent {
    constructor(props: any) {
        super(template, props);
    }

    _addEventListeners() {
        const elem: HTMLElement | null = this.getElement();
        if (!elem)
            return;
        const eye_btn: HTMLImageElement | null = elem.querySelector<HTMLImageElement>(".login-form_eye");
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

        const send_btn: HTMLElement | null = elem.querySelector<HTMLElement>(".login_btn");
        if (!send_btn)
            return;
        this._on(send_btn, "click", this.send_data);
    }

    validate_data(email: string, password: string): {ok: boolean, message: string}[] {
        let errors: {ok: boolean; message: string}[] = [];
        const email_error: {ok: boolean, message: string} = validate_email(email);
        if (!email_error.ok) {
            errors.push(email_error);
            const email_error_elem = this.getElement()?.querySelector("");
        }
        const password_error: {ok: boolean, message: string} = validate_email(password);
        if (!password_error.ok) {
            errors.push(password_error);
        }
        return errors;
    }

    async send_data(e: Event) {
        const elem: HTMLElement | null = this.getElement();
        if (!elem)
            return;
        const email_input: HTMLInputElement | null = elem.querySelector<HTMLInputElement>("#login-form_email_input");
        if (!email_input)
            return;
        const password_input: HTMLInputElement | null = elem.querySelector<HTMLInputElement>("#login-form_password_input");
        if (!password_input)
            return;
        const email_value: string = email_input.value.trim().toLowerCase();
        const password_value: string = password_input.value.trim();
        const errors: {ok: boolean, message: string}[] = this.validate_data(email_value, password_value);
        if (errors.length > 0)
            return;
    }
}
