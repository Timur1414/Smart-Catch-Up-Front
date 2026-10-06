import {BaseComponent} from "../base_component.ts";
import template from "./notification.hbs?raw";
import "./notification.css";
import {NotificationProps} from "../../types/props_interfaces.ts";

export class Notification extends BaseComponent {
    constructor(props: NotificationProps) {
        super(template, props);
    }
}
