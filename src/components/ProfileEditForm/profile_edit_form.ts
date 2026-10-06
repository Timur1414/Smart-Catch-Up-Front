import {BaseComponent} from "../base_component.ts";
import template from "./profile_edit_form.hbs?raw";
import "./profile_edit_form.css";
import {ProfileEditProps} from "../../types/props_interfaces.ts";

export class ProfileEditForm extends BaseComponent {
    constructor(props: ProfileEditProps) {
        super(template, props);
    }
}
