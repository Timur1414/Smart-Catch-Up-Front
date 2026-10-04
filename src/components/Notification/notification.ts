import {BaseComponent} from "../base_component.ts";
import template from "./notification.hbs?raw";
import "./notification.css";

export class Notification extends BaseComponent {
    constructor(props: any) {
        super(template, props);
    }
}
