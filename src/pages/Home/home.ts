import {BasePage} from "../base_page.ts";
import template from "./home.hbs?raw";
import "./home.css";
import Handlebars from "handlebars";

export class HomePage extends BasePage {
    async render(root: HTMLElement): Promise<void> {
        let compiledTemplate = Handlebars.compile(template);
        let html = compiledTemplate({}).trim();
        root.innerHTML = html;
    }
}