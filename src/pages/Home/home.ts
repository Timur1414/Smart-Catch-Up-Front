import {BasePage} from "../base_page.ts";
import template from "./home.hbs?raw";
import "./home.css";
import Handlebars from "handlebars";
import {DigestComponent} from "../../components/Digest/digest.ts";
import {Notifications} from "../../components/Notifications/notifications.ts";
import {get_notifications} from "../../api/notifications.ts";
import {router} from "../../main.ts";
import {Modal} from "../../components/Modal/modal.ts";
import {NotificationsResponse} from "../../types/responses_interfaces.ts";
import {NotificationObject} from "../../types/objects_interfaces.ts";
import {ModalProps} from "../../types/props_interfaces.ts";

export class HomePage extends BasePage {
    async render(root: HTMLElement): Promise<void> {
        const compiledTemplate = Handlebars.compile(template);
        root.innerHTML = compiledTemplate({}).trim();

        const notifications_response = await get_notifications();
        if (notifications_response.code === 401) {
            router.navigate("/login");
            return;
        }
        if (notifications_response.code === 500 || notifications_response.code === 0) {
            const modal_props: ModalProps = {
                title: "Ошибка",
                message: notifications_response.data.message,
                autoRender: false,
            };
            const modal = new Modal(modal_props);
            modal.open();
            return;
        }
        const notifications_data: NotificationsResponse = notifications_response.data as NotificationsResponse;

        const digest: DigestComponent = new DigestComponent({});
        const notifications: Notifications = new Notifications({
            notifications: notifications_data.notifications as NotificationObject[],
        });

        const btns: NodeListOf<HTMLButtonElement> = root.querySelectorAll<HTMLButtonElement>(".home_top_btn");
        if (btns.length != 2)
            return;
        btns[0].onclick = (event: Event) => {
            event.preventDefault();
            const notification_root = root.querySelector<HTMLElement>(".home_content");
            if (!notification_root)
                return;
            notification_root.innerHTML = "";
            digest.render(notification_root);
            btns[0].classList.add("home_top_btn_selected");
            btns[1].classList.remove("home_top_btn_selected");
        };
        btns[1].onclick = (event: Event) => {
            event.preventDefault();
            const notification_root = root.querySelector<HTMLElement>(".home_content");
            if (!notification_root)
                return;
            notification_root.innerHTML = "";
            notifications.render(notification_root);
            btns[0].classList.remove("home_top_btn_selected");
            btns[1].classList.add("home_top_btn_selected");
        };
        btns[0].click();
    }
}
