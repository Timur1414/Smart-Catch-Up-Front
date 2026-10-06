import {BasePage} from "../base_page.ts";
import template from "./profile.hbs?raw";
import "./profile.css";
import Handlebars from "handlebars";
import {ProfileAvatar} from "../../components/ProfileAvatar/profile_avatar.ts";
import {ProfileEditForm} from "../../components/ProfileEditForm/profile_edit_form.ts";
import {logout} from "../../api/auth.ts";
import {router} from "../../main.ts";

export class ProfilePage extends BasePage {
    async render(root: HTMLElement): Promise<void> {
        const compiledTemplate = Handlebars.compile(template);
        root.innerHTML = compiledTemplate({}).trim();

        const content_root: HTMLElement | null = root.querySelector<HTMLElement>(".profile_content");
        if (!content_root)
            return;
        const avatar_component = new ProfileAvatar({});
        avatar_component.render(content_root);
        const form_component = new ProfileEditForm({});
        form_component.render(content_root);

        const logout_btn: HTMLButtonElement | null = root.querySelector<HTMLButtonElement>(".profile_exit_btn");
        if (!logout_btn)
            return;
        logout_btn.addEventListener("click", async (e: Event) => {
            e.preventDefault();
            await this.logout(logout_btn);
        });
    }

    async logout(logout_btn: HTMLButtonElement) {
        logout_btn.disabled = true;
        const response = await logout();
        logout_btn.disabled = false;
        if (!response.success) {
            return;
        }
        router.navigate("/");
    }
}
