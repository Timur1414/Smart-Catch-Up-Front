import {BaseComponent} from "../base_component.ts";
import template from "./digest.hbs?raw";
import "./digest.css";
import {DigestCategory} from "../DigestCategory/digest_category.ts";
import {DigestProps} from "../../types/props_interfaces.ts";
import {CategoryObject, ImportantCategoryObject} from "../../types/objects_interfaces.ts";
import {formatDigestCreationTime} from "../../utils/date.ts";


export class DigestComponent extends BaseComponent {
    private important_categories: ImportantCategoryObject[] = [];
    private categories: CategoryObject[] = [];

    constructor(props: DigestProps) {
        if (!props.created_at)
            props.created_at = Date.now().toString();
        props.created_at = formatDigestCreationTime(props.created_at);
        super(template, props);
        this.important_categories = props.important;
        this.categories = props.categories;
    }

    _afterRender() {
        let elem: HTMLElement | null = this.getElement();
        if (!elem)
            return;
        let digest_category_root: HTMLElement | null = elem.querySelector<HTMLElement>(".home_digest_content");
        if (!digest_category_root)
            return;
        if (this.categories.length === 0 && this.important_categories.length === 0) {
            digest_category_root.innerText = "Дайджест ещё не сформировался...";
            return;
        }
        digest_category_root.innerText = "";
        if (this.important_categories.length > 0) {
            const content: string[] = [];
            for (let i = 0; i < this.important_categories.length; i++) {
                content.push(this.important_categories[i].notification);
            }
            let component: DigestCategory = new DigestCategory({
                header: "Важное",
                content: content.join("\n"),
            });
            component.render(digest_category_root);
        }
        for (let i = 0; i < this.categories.length; i++) {
            let component: DigestCategory = new DigestCategory({
                header: this.categories[i].category_type,
                content: this.categories[i].text,
            });
            component.render(digest_category_root);
        }
    }
}
