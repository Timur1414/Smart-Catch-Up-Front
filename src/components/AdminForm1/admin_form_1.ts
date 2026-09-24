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
        const select_type_input_props: SelectInputProps = {
            name: "notification_type",
            label: "Тип уведомления",
            placeholder: "Выберите тип уведомления",
            options: ["a", "b", "c"],
        };
        const select_type_component = new SelectInput(select_type_input_props);
        select_type_component.render(root);
        const select_user_input_props: SelectInputProps = {
            name: "user_id",
            label: "Пользователь",
            placeholder: "Выберите пользователя",
            options: ["1", "2", "3"],
        };
        const select_user_component = new SelectInput(select_user_input_props);
        select_user_component.render(root);
    }
}
