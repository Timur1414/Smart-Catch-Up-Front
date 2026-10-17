import {BaseComponent} from "../base_component.ts";
import template from "./profile_avatar.hbs?raw";
import "./profile_avatar.css";
import {ProfileAvatarProps} from "../../types/props_interfaces.ts";
import {SelectAvatar} from "../SelectAvatar/select_avatar.ts";

export class ProfileAvatar extends BaseComponent{
    private readonly url: string;

    constructor(props: ProfileAvatarProps) {
        super(template, props);
        this.url = props.url;
    }

    _addEventListeners() {
        const update_btn: HTMLButtonElement | null | undefined = this.getElement()?.querySelector<HTMLButtonElement>(".profile_avatar_change_btn");
        if (update_btn) {
            this._on(update_btn, "click", (e: Event) => {
                e.preventDefault();
                const modal = new SelectAvatar({url: this.url});
                modal.open();
            });
        }
    }
}
