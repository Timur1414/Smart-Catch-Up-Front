import {BaseComponent} from "../base_component.ts";
import template from "./digest.hbs?raw";
import "./digest.css";
import {DigestCategory} from "../DigestCategory/digest_category.ts";

export class DigestComponent extends BaseComponent {
    constructor(props: any) {
        super(template, props);
    }

    _afterRender() {
        let elem: HTMLElement | null = this.getElement();
        if (!elem)
            return;
        let digest_category_root: HTMLElement | null = elem.querySelector<HTMLElement>(".home_digest_content");
        if (!digest_category_root)
            return;
        digest_category_root.innerText = "";
        for (let i = 0; i < 5; i++) {
            let component = new DigestCategory({
                header: String(i),
                content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised thanks to these sheets and more recently with desktop publishing software like Aldus PageMaker and Microsoft Word including versions of Lorem Ipsum.",
            });
            component.render(digest_category_root);
        }
    }
}
