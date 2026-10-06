import {BaseComponent} from "../base_component.ts";
import template from "./register_form.hbs?raw";
import "./register_form.css";
import {validate_email, validate_password, validate_passwords_equal} from "../../utils/validators.ts";
import {register} from "../../api/auth.ts";
import {router} from "../../main.ts";

export class RegisterForm extends BaseComponent {
    constructor(props: any) {
        super(template, props);
    }

    _addEventListeners() {
        const eye1: HTMLImageElement | null | undefined = this.getElement()?.querySelector<HTMLImageElement>(".register-form_eye");
        if (!eye1)
            return;
        const eye2: HTMLImageElement | null | undefined = this.getElement()?.querySelector<HTMLImageElement>(".register-form_eye2");
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

        const send_btn: HTMLElement | null | undefined = this.getElement()?.querySelector<HTMLElement>(".register_btn");
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

    validate_data(email: string, password: string, confirm_password: string): boolean {
        const email_error_elem: HTMLElement | null | undefined = this.getElement()?.querySelector<HTMLElement>("#register-form_email_error");
        if (!email_error_elem)
            return false;
        const password_error_elem: HTMLElement | null | undefined = this.getElement()?.querySelector<HTMLElement>("#register-form_password_error");
        if (!password_error_elem)
            return false;
        const confirm_password_error_elem: HTMLElement | null | undefined = this.getElement()?.querySelector<HTMLElement>("#register-form_password2_error");
        if (!confirm_password_error_elem)
            return false;
        let ok: boolean = true;
        email_error_elem.innerText = "";
        password_error_elem.innerText = "";
        confirm_password_error_elem.innerText = "";
        const email_error: {ok: boolean, message: string} = validate_email(email);
        if (!email_error.ok) {
            ok = false;
            email_error_elem.innerText = email_error.message;
        }
        const password_error: {ok: boolean, message: string} = validate_password(password);
        if (!password_error.ok) {
            ok = false;
            password_error_elem.innerText = password_error.message;
        }
        const confirm_password_error: {ok: boolean, message: string} = validate_passwords_equal(password, confirm_password);
        if (!confirm_password_error.ok) {
            ok = false;
            confirm_password_error_elem.innerText = confirm_password_error.message;
        }
        return ok;
    }

    async send_data(e: Event) {
        e.preventDefault();
        const email_input: HTMLInputElement | null | undefined = this.getElement()?.querySelector<HTMLInputElement>("#register-form_email_input");
        if (!email_input)
            return;
        const password_input: HTMLInputElement | null | undefined = this.getElement()?.querySelector<HTMLInputElement>("#register-form_password_input");
        if (!password_input)
            return;
        const confirm_password: HTMLInputElement | null | undefined = this.getElement()?.querySelector<HTMLInputElement>("#register-form_password2_input");
        if (!confirm_password)
            return;
        const email_value: string = email_input.value.trim().toLowerCase();
        const password_value: string = password_input.value.trim();
        const confirm_password_value: string = confirm_password.value.trim();
        const ok: boolean = this.validate_data(email_value, password_value, confirm_password_value);
        if (!ok)
            return;
        const response = await register(email_value, password_value, confirm_password_value);
        if (!response.success) {
            const confirm_password_error_elem: HTMLElement | null | undefined = this.getElement()?.querySelector<HTMLElement>("#register-form_password2_error");
            if (!confirm_password_error_elem)
                return false;
            confirm_password_error_elem.innerText = response.data.message;
            return;
        }
        router.navigate("/");
    }
}
