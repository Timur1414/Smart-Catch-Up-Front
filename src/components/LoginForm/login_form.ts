import {BaseComponent} from "../base_component.ts";
import template from "./login_form.hbs?raw";
import "./login_form.css";
import {login, login2FA} from "../../api/auth.ts";
import {router} from "../../main.ts";
import {ModalProps} from "../../types/props_interfaces.ts";
import {Modal} from "../Modal/modal.ts";
import {LoginSuccessResponse} from "../../types/responses_interfaces.ts";

export class LoginForm extends BaseComponent {
    private temp_token: string = "";
    constructor(props: any) {
        super(template, props);
        this.temp_token = props.temp_token || "";
        console.log("=", this.temp_token);
    }

    _addEventListeners() {
        const eye_btn: HTMLImageElement | null | undefined = this.getElement()?.querySelector<HTMLImageElement>(".login-form_eye");
        if (eye_btn) {
            this._on(eye_btn, "click", (event: Event) => {
                event.preventDefault();
                const password_input = this.getElement()?.querySelector<HTMLInputElement>("input[name='password']");
                if (!password_input) return;
                const is_password = password_input.type === "password";
                password_input.type = is_password ? "text" : "password";
                eye_btn.src = is_password ? "/icons/closed_eye.png" : "/icons/eye.png";
            });
        }
        const send_btn: HTMLElement | null | undefined = this.getElement()?.querySelector<HTMLElement>(".login_btn");
        if (send_btn) {
            this._on(send_btn, "click", this.send_data);
        }
        const send2FA_btn: HTMLElement | null | undefined = this.getElement()?.querySelector<HTMLElement>(".login2FA_btn");
        if (send2FA_btn) {
            this._on(send2FA_btn, "click", this.send2FA_data);
        }
    }

    show2FAStep(temp_token: string): void {
        this.update({
            step1: false,
            temp_token: temp_token,
        });
    }

    async send2FA_data(e: Event) {
        e.preventDefault();
        console.log("token", this.temp_token)
        const code_input: HTMLInputElement | null | undefined = this.getElement()?.querySelector<HTMLInputElement>("#login-form_totp_input");
        if (!code_input)
            return;
        const code_value: string = code_input.value;
        const response = await login2FA(this.temp_token, code_value);
        if (!response.success) {
            const modal_props: ModalProps = {
                title: "Ошибка",
                message: response.data.message,
                autoRender: false,
            };
            const modal: Modal = new Modal(modal_props);
            modal.open();
            return
        }
        router.navigate("/");
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
        const data = response.data as LoginSuccessResponse;
        if (data.mfa_required) {
            this.temp_token = data.temp_token || "";
            this.show2FAStep(this.temp_token);
            return;
        }
        router.navigate("/");
    }
}
