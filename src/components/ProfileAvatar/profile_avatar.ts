import {BaseComponent} from "../base_component.ts";
import template from "./profile_avatar.hbs?raw";
import "./profile_avatar.css";

export class ProfileAvatar extends BaseComponent{
    constructor(props: any) {
        super(template, props);
    }
}
