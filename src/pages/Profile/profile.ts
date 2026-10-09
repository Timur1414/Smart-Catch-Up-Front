import { BasePage } from "../base_page.ts";
import template from "./profile.hbs?raw";
import "./profile.css";
import Handlebars from "handlebars";
import { ProfileAvatar } from "../../components/ProfileAvatar/profile_avatar.ts";
import { ProfileEditForm } from "../../components/ProfileEditForm/profile_edit_form.ts";
import { logout } from "../../api/auth.ts";
import { router } from "../../main.ts";
import { Modal } from "../../components/Modal/modal.ts";
import { get_profile } from "../../api/profile.ts";
import { ProfileResponse } from "../../types/responses_interfaces.ts";
import { ModalProps } from "../../types/props_interfaces.ts";
import {TwoFactorModal} from "../../components/TwoFactorModal/two_factor_modal.ts";

export class ProfilePage extends BasePage {
    async render(root: HTMLElement): Promise<void> {
        const compiledTemplate = Handlebars.compile(template);
        root.innerHTML = compiledTemplate({}).trim();

        const response = await get_profile();
        if (response.code === 401) {
            router.navigate("/login");
            return;
        }
        if (response.code === 500 || response.code === 0) {
            const modal_props: ModalProps = {
                title: "Ошибка",
                message: response.data.message,
                autoRender: false,
                onClose: () => {
                    router.navigate("/");
                },
            };
            const modal = new Modal(modal_props);
            modal.open();
            return;
        }
        const profile_data: ProfileResponse = response.data as ProfileResponse;

        const content_root: HTMLElement | null = root.querySelector<HTMLElement>(".profile_content");
        if (!content_root)
            return;
        const avatar_component = new ProfileAvatar({
            url: profile_data.avatar_url,
        });
        avatar_component.render(content_root);
        const form_component = new ProfileEditForm({
            email: profile_data.email,
            first_name: profile_data.first_name,
            last_name: profile_data.last_name,
        });
        form_component.render(content_root);

        const logout_btn: HTMLButtonElement | null = root.querySelector<HTMLButtonElement>(".profile_exit_btn");
        if (!logout_btn)
            return;
        logout_btn.addEventListener("click", async (e: Event) => {
            e.preventDefault();
            await this.logout(logout_btn);
        });
        const twoFaBtn: HTMLButtonElement | null = root.querySelector<HTMLButtonElement>(".profile_2fa_btn");
        if (twoFaBtn) {
            twoFaBtn.addEventListener("click", (e: Event) => {
                e.preventDefault();
                const modal = new TwoFactorModal();
                modal.open();
            });
        }
    }

    async logout(logout_btn: HTMLButtonElement) {
        logout_btn.disabled = true;
        const response = await logout();
        logout_btn.disabled = false;
        if (!response.success) {
            const modal_props: ModalProps = {
                message: response.data.message,
                title: "Ошибка",
                autoRender: false,
            };
            const modal = new Modal(modal_props);
            modal.open();
            return;
        }
        router.navigate("/");
    }
}