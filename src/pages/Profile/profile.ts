import {BasePage} from "../base_page.ts";
import template from "./profile.hbs?raw";
import "./profile.css";
import Handlebars from "handlebars";
import {ProfileAvatar} from "../../components/ProfileAvatar/profile_avatar.ts";
import {ProfileEditForm} from "../../components/ProfileEditForm/profile_edit_form.ts";

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
    }
}
