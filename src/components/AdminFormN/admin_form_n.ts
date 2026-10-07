import {BaseComponent} from "../base_component.ts";
import template from "./admin_form_n.hbs?raw";
import "./admin_form_n.css";
import {MultiSelectInput} from "../MultiSelectInput/multi_select_input.ts";
import {validate_min_value, validate_notification_types, validate_user_ids} from "../../utils/validators.ts";
import {generate_n} from "../../api/admin.ts";
import {router} from "../../main.ts";
import {MultiSelectInputProps, MultiSelectOption} from "../../types/props_interfaces.ts";
import {get_allowed_notification_types, get_allowed_user_ids} from "../../store/store.ts";
import {ShortUserObject} from "../../types/objects_interfaces.ts";

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
            options: get_allowed_notification_types(),
        };
        const multiselect_types_input_component = new MultiSelectInput(multiselect_types_props);
        multiselect_types_input_component.render(root);
        const multiselect_types_error: HTMLParagraphElement = document.createElement("p");
        multiselect_types_error.className = "admin_form_n_error";
        multiselect_types_error.id = "admin_form_n_types_error";
        root.appendChild(multiselect_types_error);
        const users_options: MultiSelectOption[] = [];
        const users: ShortUserObject[] = get_allowed_user_ids();
        for (const user of users) {
            if (user.full_name !== "")
                users_options.push({
                    value: user.id,
                    label: user.full_name,
                });
        }
        const multiselect_users_props: MultiSelectInputProps = {
            name: "user_ids",
            label: "Пользователи",
            placeholder: "Пользователи",
            options: users_options,
        };
        const multiselect_users_input_component = new MultiSelectInput(multiselect_users_props);
        multiselect_users_input_component.render(root);
        const multiselect_users_error: HTMLParagraphElement = document.createElement("p");
        multiselect_users_error.className = "admin_form_n_error";
        multiselect_users_error.id = "admin_form_n_users_error";
        root.appendChild(multiselect_users_error);
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

    validate_data(count: string, types: string[], users: string[]): boolean {
        const count_error_elem: HTMLParagraphElement | null | undefined = this.getElement()?.querySelector<HTMLParagraphElement>("#admin_form_n_number_error");
        if (!count_error_elem)
            return false;
        const types_error_elem: HTMLParagraphElement | null | undefined = this.getElement()?.querySelector<HTMLParagraphElement>("#admin_form_n_types_error");
        if (!types_error_elem)
            return false;
        const users_error_elem: HTMLParagraphElement | null | undefined = this.getElement()?.querySelector<HTMLParagraphElement>("#admin_form_n_users_error");
        if (!users_error_elem)
            return false;
        this.clear_errors([count_error_elem, types_error_elem, users_error_elem]);
        let ok: boolean = true;
        const count_error: {ok: boolean, message: string} = validate_min_value(count);
        if (!count_error.ok) {
            ok = false;
            count_error_elem.innerText = count_error.message;
        }
        const types_error = validate_notification_types(types);
        if (!types_error.ok) {
            ok = false;
            types_error_elem.innerText = types_error.message;
        }
        const users_error = validate_user_ids(users);
        if (!users_error.ok) {
            ok = false;
            users_error_elem.innerText = users_error.message;
        }
        return ok;
    }

    async send_data(e: Event) {
        e.preventDefault();
        const count_input: HTMLInputElement | null | undefined = this.getElement()?.querySelector<HTMLInputElement>("#admin_form_n_number_input");
        if (!count_input)
            return;
        const types_input: HTMLInputElement | null | undefined = this.getElement()?.querySelector<HTMLInputElement>("input[name='notification_types']");
        if (!types_input)
            return;
        const users_input: HTMLInputElement | null | undefined = this.getElement()?.querySelector<HTMLInputElement>("input[name='user_ids']");
        if (!users_input)
            return;
        const count_value: string = count_input.value;
        const types_value: string[] = types_input.value.split(",");
        const users_value: string[] = users_input.value.split(",");
        const ok: boolean = this.validate_data(count_value, types_value, users_value);
        if (!ok)
            return;
        const users_ids: number[] = users_value.map(Number)
        const send_btn: HTMLButtonElement | null | undefined = this.getElement()?.querySelector<HTMLButtonElement>(".admin_create_btn");
        if (!send_btn)
            return;
        send_btn.disabled = true;
        const response = await generate_n(types_value, Number(count_value), users_ids)
        send_btn.disabled = false;
        if (!response.success) {
            const users_error_elem: HTMLParagraphElement | null | undefined = this.getElement()?.querySelector<HTMLParagraphElement>("#admin_form_n_users_error");
            if (!users_error_elem)
                return;
            users_error_elem.innerText = response.data.message;
            return;
        }
        router.navigate("/");
    }

    clear_errors(elems: HTMLParagraphElement[]): void {
        for (const elem of elems) {
            elem.innerText = "";
        }
    }
}
