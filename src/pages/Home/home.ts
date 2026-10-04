import {BasePage} from "../base_page.ts";
import template from "./home.hbs?raw";
import "./home.css";
import Handlebars from "handlebars";
import {DigestComponent} from "../../components/Digest/digest.ts";
import {Notifications} from "../../components/Notifications/notifications.ts";

export class HomePage extends BasePage {
    async render(root: HTMLElement): Promise<void> {
        const compiledTemplate = Handlebars.compile(template);
        root.innerHTML = compiledTemplate({}).trim();

        const digest: DigestComponent = new DigestComponent({});
        const notifications: Notifications = new Notifications({});

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
