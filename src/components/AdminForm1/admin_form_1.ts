import {BaseComponent} from "../base_component.ts";
import template from "./admin_form_1.hbs?raw";
import "./admin_form_1.css";
import {SelectInput} from "../SelectInput/select_input.ts";
import {validate_not_empty, validate_notification_type, validate_user_id} from "../../utils/validators.ts";
import {generate_1} from "../../api/admin.ts";
import {router} from "../../main.ts";
import { SelectInputProps, SelectOption} from "../../types/props_interfaces.ts";
import {get_allowed_notification_types, get_allowed_user_ids} from "../../store/store.ts";
import {ShortUserObject} from "../../types/objects_interfaces.ts";

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
            options: get_allowed_notification_types(),
        };
        const select_type_component = new SelectInput(select_type_input_props);
        select_type_component.render(root);
        const select_type_error: HTMLParagraphElement = document.createElement("p");
        select_type_error.className = "admin_form_1_error";
        select_type_error.id = "admin_form_1_type_error";
        root.appendChild(select_type_error);
        const users_options: SelectOption[] = [];
        const users: ShortUserObject[] = get_allowed_user_ids();
        for (const user of users) {
            if (user.full_name !== "")
                users_options.push({
                    value: user.id,
                    label: user.full_name,
                });
        }
        const select_user_input_props: SelectInputProps = {
            name: "user_id",
            label: "Пользователь",
            placeholder: "Выберите пользователя",
            options: users_options,
        };
        const select_user_component = new SelectInput(select_user_input_props);
        select_user_component.render(root);
        const select_user_error: HTMLParagraphElement = document.createElement("p");
        select_user_error.className = "admin_form_1_error";
        select_user_error.id = "admin_form_1_user_error";
        root.appendChild(select_user_error);
    }

    _addEventListeners() {
        const create_btn: HTMLButtonElement | null | undefined = this.getElement()?.querySelector<HTMLButtonElement>(".admin_create_btn");
        if (!create_btn)
            return;
        this._on(create_btn, "click", this.send_data);
    }

    validate_data(text: string, type: string, user: string): boolean {
        const text_error_elem: HTMLParagraphElement | null | undefined = this.getElement()?.querySelector<HTMLParagraphElement>("#admin_form_1_text_error");
        if (!text_error_elem)
            return false;
        const type_error_elem: HTMLParagraphElement | null | undefined = this.getElement()?.querySelector<HTMLParagraphElement>("#admin_form_1_type_error");
        if (!type_error_elem)
            return false;
        const user_error_elem: HTMLParagraphElement | null | undefined = this.getElement()?.querySelector<HTMLParagraphElement>("#admin_form_1_user_error");
        if (!user_error_elem)
            return false;
        this.clear_errors([text_error_elem, type_error_elem, user_error_elem]);
        let ok: boolean = true;
        const text_error: {ok: boolean, message: string} = validate_not_empty(text);
        if (!text_error.ok) {
            ok = false;
            text_error_elem.innerText = text_error.message;
        }
        const type_error: {ok: boolean, message: string} = validate_notification_type(type);
        if (!type_error.ok) {
            ok = false;
            type_error_elem.innerText = type_error.message;
        }
        const user_error: {ok: boolean, message: string} = validate_user_id(user);
        if (!user_error.ok) {
            ok = false;
            user_error_elem.innerText = user_error.message;
        }
        return ok;
    }

    async send_data(e: Event) {
        e.preventDefault();
        const text_input: HTMLTextAreaElement | null | undefined = this.getElement()?.querySelector<HTMLTextAreaElement>("#admin_form_1_text_input");
        if (!text_input)
            return;
        const type_select: HTMLInputElement | null | undefined = this.getElement()?.querySelector<HTMLInputElement>("input[name='notification_type']");
        if (!type_select)
            return;
        const user_select: HTMLInputElement | null | undefined = this.getElement()?.querySelector<HTMLInputElement>("input[name='user_id']");
        if (!user_select)
            return;
        const text_value: string = text_input.value;
        const type_value: string = type_select.value;
        const user_value: string = user_select.value;
        const ok: boolean = this.validate_data(text_value, type_value, user_value);
        if (!ok)
            return;
        const send_btn: HTMLButtonElement | null | undefined = this.getElement()?.querySelector<HTMLButtonElement>(".admin_create_btn");
        if (!send_btn)
            return;
        send_btn.disabled = true;
        const response = await generate_1(type_value, text_value, Number(user_value));
        send_btn.disabled = false;
        if (!response.success) {
            const user_error_elem: HTMLParagraphElement | null | undefined = this.getElement()?.querySelector<HTMLParagraphElement>("#admin_form_1_user_error");
            if (!user_error_elem)
                return false;
            user_error_elem.innerText = response.data.message;
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
