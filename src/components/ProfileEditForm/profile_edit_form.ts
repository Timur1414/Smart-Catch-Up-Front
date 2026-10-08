import {BaseComponent} from "../base_component.ts";
import template from "./profile_edit_form.hbs?raw";
import "./profile_edit_form.css";
import {ProfileEditProps} from "../../types/props_interfaces.ts";

export class ProfileEditForm extends BaseComponent {
    constructor(props: ProfileEditProps) {
        super(template, props);
    }

    _addEventListeners() {
        const send_btn: HTMLInputElement | null | undefined = this.getElement()?.querySelector<HTMLInputElement>("#profile_edit_form_email_input");
        if (!send_btn)
            return;
        send_btn.disabled = true;

        send_btn.disabled = false;
    }
}
