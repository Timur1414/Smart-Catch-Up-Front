import {BaseComponent} from "../base_component.ts";
import template from "./profile_avatar.hbs?raw";
import "./profile_avatar.css";
import {ProfileAvatarProps} from "../../types/props_interfaces.ts";

export class ProfileAvatar extends BaseComponent{
    constructor(props: ProfileAvatarProps) {
        super(template, props);
    }
}
