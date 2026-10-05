import {BaseComponent} from "../base_component.ts";
import template from "./admin_form_n.hbs?raw";
import "./admin_form_n.css";
import {MultiSelectInput, MultiSelectInputProps} from "../MultiSelectInput/multi_select_input.ts";

export class AdminFormN extends BaseComponent {
    constructor(props: any) {
        super(template, props);
    }

    render(container: HTMLElement) {
        super.render(container);
        const root: HTMLElement | null = container.querySelector<HTMLElement>(".admin_form_n_inputs");
        if (!root)
            return;
        const multiselect_types_props: MultiSelectInputProps = {
            name: "notification_types",
            label: "Типы уведомлений",
            placeholder: "Типы уведомлений",
            options: ["a", "b", "c"],
        };
        const multiselect_types_input_component = new MultiSelectInput(multiselect_types_props);
        multiselect_types_input_component.render(root);
        const multiselect_users_props: MultiSelectInputProps = {
            name: "user_ids",
            label: "Пользователи",
            placeholder: "Пользователи",
            options: ["1", "2", "3"],
        };
        const multiselect_users_input_component = new MultiSelectInput(multiselect_users_props);
        multiselect_users_input_component.render(root);
    }

    _addEventListeners() {
        const elem: HTMLElement | null = this.getElement();
        if (!elem)
            return;
        const create_btn: HTMLButtonElement | null = elem.querySelector<HTMLButtonElement>(".admin_create_btn");
        if (!create_btn)
            return;
        this._on(create_btn, "click", this.send_data);
    }

    async send_data(e: Event) {
        console.log('click');
    }
}
