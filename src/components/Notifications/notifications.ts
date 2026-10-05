import {BaseComponent} from "../base_component.ts";
import template from "./notifications.hbs?raw";
import "./notifications.css";
import {Notification} from "../Notification/notification.ts";

export class Notifications extends BaseComponent {
    constructor(props: any) {
        super(template, props);
    }

    render(container: HTMLElement) {
        super.render(container);
        const notification_root: HTMLElement | null = container.querySelector<HTMLElement>(".home_notifications_content");
        if (!notification_root)
            return;
        for (let i: number = 0; i < 10; i++) {
            const notification = new Notification({
                actor: "system",
                date: `${i} days ago`,
                payload: "some text",
                img: "/avatar/123.png",
            });
            notification.render(notification_root);
        }
    }

    load_notifications() {
        console.log("Loading notifications");
    }
}
