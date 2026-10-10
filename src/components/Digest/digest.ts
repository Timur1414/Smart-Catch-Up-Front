import {BaseComponent} from "../base_component.ts";
import template from "./digest.hbs?raw";
import "./digest.css";
import {DigestCategory} from "../DigestCategory/digest_category.ts";
import {DigestProps} from "../../types/props_interfaces.ts";
import {CategoryObject, ImportantCategoryObject} from "../../types/objects_interfaces.ts";


export class DigestComponent extends BaseComponent {
    private important_categories: ImportantCategoryObject[] = [];
    private categories: CategoryObject[] = [];
    private created_at: string;

    constructor(props: DigestProps) {
        super(template, props);
        console.log("props", props)
        this.important_categories = props.important;
        this.categories = props.categories;
        this.created_at = props.created_at;
    }

    _afterRender() {
        let elem: HTMLElement | null = this.getElement();
        if (!elem)
            return;
        let digest_category_root: HTMLElement | null = elem.querySelector<HTMLElement>(".home_digest_content");
        if (!digest_category_root)
            return;
        if (this.categories.length === 0) {
            digest_category_root.innerText = "Дайджест ещё не сформировался...";
            return;
        }
        digest_category_root.innerText = "";
        for (let i = 0; i < 5; i++) {
            let component = new DigestCategory({
                header: this.categories[i].category_type,
                content: this.categories[i].text,
            });
            component.render(digest_category_root);
        }
    }
}
