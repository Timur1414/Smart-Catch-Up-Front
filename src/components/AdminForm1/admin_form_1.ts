import {BaseComponent} from "../base_component.ts";
import template from "./admin_form_1.hbs?raw";
import "./admin_form_1.css";
import {SelectInput, SelectInputProps} from "../SelectInput/select_input.ts";

export class AdminForm1 extends BaseComponent {
    constructor(props: any) {
        super(template, props);
    }
    render(container: HTMLElement) {
        super.render(container);
        const root: HTMLElement | null = container.querySelector<HTMLElement>(".admin_form_1_inputs");
        if (!root)
            return;
        const props: SelectInputProps = {
            name: "notification_type",
            label: "Тип уведомления",
            placeholder: "Выберите тип уведомления",
            options: ["a", "b", "c"],
        };
        const select = new SelectInput(props);
        select.render(root);
    }
}
