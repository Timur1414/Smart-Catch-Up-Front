import {BasePage} from "../base_page.ts";
import template from "./profile.hbs?raw";
import "./profile.css";
import Handlebars from "handlebars";

export class ProfilePage extends BasePage {
    async render(root: HTMLElement): Promise<void> {
        const compiledTemplate = Handlebars.compile(template);
        root.innerHTML = compiledTemplate({}).trim();
    }
}
