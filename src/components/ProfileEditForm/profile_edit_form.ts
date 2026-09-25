import {BaseComponent} from "../base_component.ts";
import template from "./profile_edit_form.hbs?raw";
import "./profile_edit_form.css";

export class ProfileEditForm extends BaseComponent {
    constructor(props: any) {
        super(template, props);
    }
}
