import {BaseComponent} from "../base_component.ts";
import template from "./admin_form_n.hbs?raw";
import "./admin_form_n.css";

export class AdminFormN extends BaseComponent {
    constructor(props: any) {
        super(template, props);
    }
}
