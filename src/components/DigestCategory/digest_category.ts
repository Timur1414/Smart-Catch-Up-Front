import {BaseComponent} from "../base_component.ts";
import template from "./digest_category.hbs?raw";
import "./digest_category.css";
import {DigestCategoryProps} from "../../types/props_interfaces.ts";

export class DigestCategory extends BaseComponent {
    constructor(props: DigestCategoryProps) {
        super(template, props);
        console.log(props.content)
    }

    _addEventListeners() {
        const element: HTMLElement | null = this.getElement();
        if (!element)
            return;
        this._on(element, "click", () => {
            element.classList.toggle("digest-category_open");
            let arrow: HTMLImageElement | null = element.querySelector<HTMLImageElement>(".digest-category_header_arrow");
            arrow?.classList.toggle("digest-category_header_arrow_open");
        });
    }
}
