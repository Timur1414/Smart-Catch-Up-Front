import {BaseComponent} from "../base_component.ts";
import template from "./notifications.hbs?raw";
import "./notifications.css";
import {Notification} from "../Notification/notification.ts";
import {NotificationObject} from "../../types/objects_interfaces.ts";
import {ModalProps, NotificationsProps} from "../../types/props_interfaces.ts";
import {get_all_notifications} from "../../api/notifications.ts";
import {Modal} from "../Modal/modal.ts";
import {NotificationsResponse} from "../../types/responses_interfaces.ts";


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

    _addEventListeners() {
        const show_all_btn: HTMLButtonElement | null | undefined = this.getElement()?.querySelector<HTMLButtonElement>(".home_notifications_show_all_btn");
        if (!show_all_btn)
            return;
        this._on(show_all_btn, "click", this.show_all_notifications);
    }

    async show_all_notifications(e: Event) {
        e.preventDefault();
        const notifications_root: HTMLDivElement | null | undefined = this.getElement()?.querySelector<HTMLDivElement>(".home_notifications_content");
        if (!notifications_root)
            return;
        const show_all_btn: HTMLButtonElement | null | undefined = this.getElement()?.querySelector<HTMLButtonElement>(".home_notifications_show_all_btn");
        if (!show_all_btn)
            return;
        show_all_btn.disabled = true;
        const response = await get_all_notifications();
        if (!response.success) {
            const modal_props: ModalProps = {
                message: response.data.message,
                title: "Ошибка",
                autoRender: false,
            };
            const modal: Modal = new Modal(modal_props);
            modal.open();
            return;
        }
        show_all_btn.style.display = "none";
        notifications_root.innerHTML = "";
        const data: NotificationsResponse = response.data as NotificationsResponse;
        const all_notifications: NotificationObject[] = data.notifications;
        for (let i: number = 0; i < all_notifications.length; i++) {
            const notification = new Notification({
                actor: all_notifications[i].actor,
                date: all_notifications[i].date,
                payload: all_notifications[i].payload,
                img: all_notifications[i].img,
            });
            notification.render(notifications_root);
        }
    }
}
