import { BaseComponent } from "../base_component.ts";
import template from "./two_factor_modal.hbs?raw";
import "./two_factor_modal.css";
import { setup2FA, enable2FA, disable2FA } from "../../api/auth.ts";
import {TwoFactorModalProps} from "../../types/props_interfaces.ts";
import {toDataURL} from "qrcode";


export class TwoFactorModal extends BaseComponent {
    private _onCloseCallback?: () => void;
    private _onSuccessCallback?: () => void;
    private _keydownHandler: ((event: KeyboardEvent) => void) | null = null;

    constructor(props: TwoFactorModalProps = {}) {
        super(template, {
            state: "menu",
            error_message: "",
        });

        this._onCloseCallback = props.onClose;
        this._onSuccessCallback = props.onSuccess;
    }

    override _addEventListeners(): void {
        const element: HTMLElement | null = this.getElement();
        if (!element) return;
        this._on(element, "click", (e: Event) => {
            if (e.target === element) {
                this.close();
            }
        });
        const closeBtn: HTMLElement | null = element.querySelector<HTMLElement>(".two_factor_modal_close_btn");
        if (closeBtn) {
            this._on(closeBtn, "click", (e: Event) => {
                e.preventDefault();
                this.close();
            });
        }
        if (!this._keydownHandler) {
            this._keydownHandler = (event: KeyboardEvent) => {
                if (event.key === "Escape") {
                    this.close();
                }
            };
            window.addEventListener("keydown", this._keydownHandler);
        }
        const toSetupBtn: HTMLElement | null = element.querySelector<HTMLElement>("#btn_to_setup");
        if (toSetupBtn) {
            this._on(toSetupBtn, "click", async () => {
                await this._startSetup();
            });
        }
        const toDisableBtn: HTMLElement | null = element.querySelector<HTMLElement>("#btn_to_disable");
        if (toDisableBtn) {
            this._on(toDisableBtn, "click", () => {
                this.update({ state: "disable", error_message: "" });
            });
        }
        const backBtn: HTMLElement | null = element.querySelector<HTMLElement>("#btn_back_to_menu");
        if (backBtn) {
            this._on(backBtn, "click", () => {
                this.update({ state: "menu", error_message: "" });
            });
        }
        const confirmEnableBtn: HTMLButtonElement | null = element.querySelector<HTMLButtonElement>("#btn_confirm_enable");
        if (confirmEnableBtn) {
            this._on(confirmEnableBtn, "click", async () => {
                await this._confirmEnable(confirmEnableBtn);
            });
        }
        const copyBackupBtn: HTMLButtonElement | null = element.querySelector<HTMLButtonElement>("#btn_copy_backup_codes");
        if (copyBackupBtn) {
            this._on(copyBackupBtn, "click", () => {
                const codes = (this as any)._props.backup_codes || [];
                navigator.clipboard.writeText(codes.join("\n"));
                copyBackupBtn.innerText = "Скопировано!";
            });
        }
        const finishSetupBtn: HTMLElement | null = element.querySelector<HTMLElement>("#btn_finish_setup");
        if (finishSetupBtn) {
            this._on(finishSetupBtn, "click", () => {
                this._onSuccessCallback?.();
                this.close();
            });
        }
        const confirmDisableBtn: HTMLButtonElement | null = element.querySelector<HTMLButtonElement>("#btn_confirm_disable");
        if (confirmDisableBtn) {
            this._on(confirmDisableBtn, "click", async () => {
                await this._confirmDisable(confirmDisableBtn);
            });
        }
        const closeModalBtn: HTMLElement | null = element.querySelector<HTMLElement>("#btn_close_modal");
        if (closeModalBtn) {
            this._on(closeModalBtn, "click", () => {
                this._onSuccessCallback?.();
                this.close();
            });
        }
    }

    private async _startSetup(): Promise<void> {
        this.update({ state: "loading" });
        const res = await setup2FA();
        if (!res.success) {
            this.update({
                state: "menu",
                error_message: res.data.message || "Не удалось сгенерировать 2FA секрет",
            });
            return;
        }
        const data = res.data as any;
        const qrUrl: string = await toDataURL(data.otpauth_url, {
            width: 180,
            margin: 1,
        });

        this.update({
            state: "setup",
            secret: data.secret,
            qr_url: qrUrl,
            error_message: "",
        });
    }

    private async _confirmEnable(btn: HTMLButtonElement): Promise<void> {
        const input: HTMLInputElement | null | undefined = this.getElement()?.querySelector<HTMLInputElement>("#input_setup_code");
        const code: string = input?.value.trim() ?? "";

        if (code.length !== 6) {
            this.update({ error_message: "Введите 6-значный проверочный код" });
            return;
        }

        btn.disabled = true;
        const res = await enable2FA(code);
        btn.disabled = false;

        if (!res.success) {
            this.update({ error_message: res.data.message || "Неверный проверочный код" });
            return;
        }

        const backupCodes: string[] = (res.data as any).backup_codes || [];
        this.update({
            state: "backup_codes",
            backup_codes: backupCodes,
            error_message: "",
        });
    }

    private async _confirmDisable(btn: HTMLButtonElement): Promise<void> {
        const input: HTMLInputElement | null | undefined = this.getElement()?.querySelector<HTMLInputElement>("#input_disable_code");
        const code: string = input?.value.trim() ?? "";
        if (!code) {
            this.update({ error_message: "Введите код подтверждения" });
            return;
        }
        btn.disabled = true;
        const res = await disable2FA(code);
        btn.disabled = false;
        if (!res.success) {
            this.update({ error_message: res.data.message || "Неверный код" });
            return;
        }
        this.update({
            state: "disable_success",
            error_message: "",
        });
    }

    public open(container: HTMLElement = document.body): void {
        this.render(container);
    }

    public close(): void {
        if (this._keydownHandler) {
            window.removeEventListener("keydown", this._keydownHandler);
            this._keydownHandler = null;
        }
        this._onCloseCallback?.();
        this.destroy();
    }
}
