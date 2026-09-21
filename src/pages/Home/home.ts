import {BasePage} from "../base_page.ts";
import template from "./home.hbs?raw";
import "./home.css";
import Handlebars from "handlebars";
import {MainMenu} from "../../components/MainMenu/main_menu.ts";

export class HomePage extends BasePage {
    async render(root: HTMLElement): Promise<void> {
        let compiledTemplate = Handlebars.compile(template);
        let html = compiledTemplate({}).trim();
        root.innerHTML = html;
        let menu = new MainMenu({});
        let menu_root =root.querySelector<HTMLElement>(".main-container");
        if (!menu_root)
            return;
        menu.render(menu_root);
    }
}