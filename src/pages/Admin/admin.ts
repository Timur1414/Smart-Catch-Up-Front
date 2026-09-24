import {BasePage} from "../base_page.ts";
import template from "./admin.hbs?raw";
import "./admin.css";
import Handlebars from "handlebars";
import {AdminForm1} from "../../components/AdminForm1/admin_form_1.ts";
import {AdminFormN} from "../../components/AdminFormN/admin_form_n.ts";

export class AdminPage extends BasePage {
    async render(root: HTMLElement): Promise<void> {
        const compiledTemplate = Handlebars.compile(template);
        root.innerHTML = compiledTemplate({}).trim();

        const form_1 = new AdminForm1({});
        const form_n = new AdminFormN({});

        const btns: NodeListOf<HTMLElement> = root.querySelectorAll<HTMLElement>(".admin_top_btn");
        btns[0].onclick = (event: Event) => {
            event.preventDefault();
            const form_root = root.querySelector<HTMLElement>(".admin_content_form_container");
            if (!form_root)
                return;
            form_root.innerHTML = "";
            form_1.render(form_root);
            btns[0].classList.add("admin_top_btn_selected");
            btns[1].classList.remove("admin_top_btn_selected");
        };
        btns[1].onclick = (event: Event) => {
            event.preventDefault();
            const form_root = root.querySelector<HTMLElement>(".admin_content_form_container");
            if (!form_root)
                return;
            form_root.innerHTML = "";
            form_n.render(form_root);
            btns[0].classList.remove("admin_top_btn_selected");
            btns[1].classList.add("admin_top_btn_selected");
        };
        btns[0].click();
    }
}
