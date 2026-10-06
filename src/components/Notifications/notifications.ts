import {BaseComponent} from "../base_component.ts";
import template from "./notifications.hbs?raw";
import "./notifications.css";
import {Notification} from "../Notification/notification.ts";
import {NotificationObject} from "../../types/objects_interfaces.ts";
import {NotificationsProps} from "../../types/props_interfaces.ts";


export class Notifications extends BaseComponent {
    private notifications: NotificationObject[] = [];

    constructor(props: NotificationsProps) {
        super(template, props);
        this.notifications = props.notifications;
    }

    render(container: HTMLElement) {
        super.render(container);
        const notification_root: HTMLElement | null = container.querySelector<HTMLElement>(".home_notifications_content");
        if (!notification_root)
            return;
        for (let i: number = 0; i < this.notifications.length; i++) {
            const notification = new Notification({
                actor: this.notifications[i].actor,
                date: this.notifications[i].date,
                payload: this.notifications[i].payload,
                img: this.notifications[i].img,
            });
            notification.render(notification_root);
        }
    }
}
