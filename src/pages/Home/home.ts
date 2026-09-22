import {BasePage} from "../base_page.ts";
import template from "./home.hbs?raw";
import "./home.css";
import Handlebars from "handlebars";
import {DigestCategory} from "../../components/DigestCategory/digest_category.ts";

export class HomePage extends BasePage {
    async render(root: HTMLElement): Promise<void> {
        let compiledTemplate = Handlebars.compile(template);
        let html = compiledTemplate({}).trim();
        root.innerHTML = html;

        let digest_category_root = root.querySelector<HTMLElement>(".home_content");
        if (!digest_category_root) {
            return;
        }
        digest_category_root.innerText = "";
        for (let i = 0; i < 5; i++) {
            let component = new DigestCategory({
                header: i,
                content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised thanks to these sheets and more recently with desktop publishing software like Aldus PageMaker and Microsoft Word including versions of Lorem Ipsum.",
            });
            component.render(digest_category_root);
        }
    }
}