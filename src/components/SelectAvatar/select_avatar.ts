import {BaseComponent} from "../base_component.ts";
import template from "./select_avatar.hbs?raw";
import "./select_avatar.css";
import {SelectAvatarProps} from "../../types/props_interfaces.ts";
import {upload_avatar} from "../../api/profile.ts";
import {router} from "../../main.ts";

export class SelectAvatar extends BaseComponent {
    constructor(props: SelectAvatarProps) {
        super(template, props);
    }

    _addEventListeners() {
        const element: HTMLElement | null = this.getElement();
        if (!element)
            return;
        this._on(element, "click", (e: Event) => {
            if (e.target === element)
                this.close();
        });
        const close_btn: HTMLButtonElement | null = element.querySelector<HTMLButtonElement>(".select_avatar_window_close_btn");
        if (close_btn) {
            this._on(close_btn, "click", (e: Event) => {
                e.preventDefault();
                this.close();
            });
        }
        const save_btn: HTMLButtonElement | null = element.querySelector<HTMLButtonElement>(".select_avatar_save_btn");
        if (save_btn) {
            this._on(save_btn, "click", async (e: Event) => {
                e.preventDefault();
                await this.update_avatar();
            });
        }
    }

    open(container: HTMLElement = document.body): void {
        this.render(container);
    }

    close(): void {
        this.destroy();
    }

    async update_avatar() {
        const error_element: HTMLParagraphElement | null | undefined = this.getElement()?.querySelector<HTMLParagraphElement>(".select_avatar_error");
        if (!error_element)
            return;
        error_element.innerText = "";
        const save_btn: HTMLButtonElement | null | undefined = this.getElement()?.querySelector<HTMLButtonElement>(".select_avatar_save_btn");
        if (!save_btn)
            return;
        const file_input: HTMLInputElement | null | undefined = this.getElement()?.querySelector<HTMLInputElement>(".select_avatar_input");
        if (!file_input)
            return;
        save_btn.disabled = true;
        const file: File | undefined = file_input.files?.[0];
        if (!file) {
            error_element.innerText = "Файл не загружен";
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            error_element.innerText = "Файл слишком большой. Максимум 5 МБ";
            file_input.value = "";
            return;
        }
        if (!file.type.startsWith("image/")) {
            error_element.innerText = "Можно загружать только изображения";
            file_input.value = "";
            return;
        }
        const response = await upload_avatar(file);
        save_btn.disabled = false;
        if (!response.success) {
            error_element.innerText = response.data.message;
            return;
        }
        this.close();
        router.navigate("/profile");
    }
}
