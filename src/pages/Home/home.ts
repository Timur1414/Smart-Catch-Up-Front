import {BasePage} from "../base_page.ts";
import template from "./home.hbs?raw";
import "./home.css";
import Handlebars from "handlebars";
import {DigestComponent} from "../../components/Digest/digest.ts";

export class HomePage extends BasePage {
    async render(root: HTMLElement): Promise<void> {
        let compiledTemplate = Handlebars.compile(template);
        root.innerHTML = compiledTemplate({}).trim();

        let digest_root: HTMLElement | null = root.querySelector<HTMLElement>(".home_content");
        if (!digest_root)
            return;
        let digest: DigestComponent = new DigestComponent({});
        digest.render(digest_root);
    }
}
