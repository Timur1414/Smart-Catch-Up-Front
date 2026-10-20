import {BaseComponent} from "../base_component.ts";
import template from "./profile_edit_form.hbs?raw";
import "./profile_edit_form.css";
import {ModalProps, MultiSelectInputProps, ProfileEditProps} from "../../types/props_interfaces.ts";
import {validate_email, validate_not_empty, validate_notification_types} from "../../utils/validators.ts";
import {Modal} from "../Modal/modal.ts";
import {update_profile} from "../../api/profile.ts";
import {router} from "../../main.ts";
import {MultiSelectInput} from "../MultiSelectInput/multi_select_input.ts";
import {get_allowed_notification_types, get_cur_user} from "../../store/store.ts";
import {UserObject} from "../../types/objects_interfaces.ts";

export class ProfileEditForm extends BaseComponent {
    constructor(props: ProfileEditProps) {
        super(template, props);
    }

    _afterRender() {
        const root: HTMLElement | null | undefined = this.getElement()?.querySelector<HTMLElement>(".profile_edit_important_types");
        if (!root)
            return;
        const user: UserObject | null = get_cur_user();
        if (!user)
            return;
        const important_types_select_props: MultiSelectInputProps = {
            name: "important_types",
            label: "Типы уведомлений",
            placeholder: "Выберите типы уведомлений",
            options: get_allowed_notification_types(),
        }
        const multiselect_important_types: MultiSelectInput = new MultiSelectInput(important_types_select_props);
        multiselect_important_types.render(root);
        multiselect_important_types.setValues(user.important);
    }

    _addEventListeners() {
        const send_btn: HTMLInputElement | null | undefined = this.getElement()?.querySelector<HTMLInputElement>(".profile_edit_send_btn");
        if (!send_btn)
            return;
        this._on(send_btn, "click", this.send_data);
    }

    validate_data(email: string, first_name: string, last_name: string, important_types: string[]): {ok: boolean, message: string} {
        let ok: boolean = true;
        let message: string = "";
        const email_error: {ok: boolean, message: string} = validate_email(email);
        if (!email_error.ok) {
            ok = false;
            message = email_error.message;
        }
        const first_name_error: {ok: boolean, message: string} = validate_not_empty(first_name);
        if (!first_name_error.ok) {
            ok = false;
            message = first_name_error.message;
        }
        const last_name_error: {ok: boolean, message: string} = validate_not_empty(last_name);
        if (!last_name_error.ok) {
            ok = false;
            message = last_name_error.message;
        }
        const types_error: { ok: boolean, message: string } = validate_notification_types(important_types);
        if (!types_error.ok) {
            ok = false;
            message = types_error.message;
        }
        return {ok: ok, message: message};
    }

    async send_data(e: Event) {
        e.preventDefault();
        const email_input: HTMLInputElement | null | undefined = this.getElement()?.querySelector<HTMLInputElement>("#profile_edit_form_email_input");
        if (!email_input)
            return;
        const first_name_input: HTMLInputElement | null | undefined = this.getElement()?.querySelector<HTMLInputElement>("#profile_edit_form_first_name_input");
        if (!first_name_input)
            return;
        const last_name_input: HTMLInputElement | null | undefined = this.getElement()?.querySelector<HTMLInputElement>("#profile_edit_form_last_name_input");
        if (!last_name_input)
            return;
        const important_types: HTMLInputElement | null | undefined = this.getElement()?.querySelector<HTMLInputElement>("input[name='important_types']");
        if (!important_types)
            return;
        const email_value: string = email_input.value;
        const first_name_value: string = first_name_input.value;
        const last_name_value: string = last_name_input.value;
        let important_types_value: string[] = important_types.value.split(",");
        if (important_types_value.length === 1 && important_types_value[0] === "")
            important_types_value = [];
        const validation_error = this.validate_data(email_value, first_name_value, last_name_value, important_types_value);
        if (!validation_error.ok) {
            const modal_props: ModalProps = {
                message: validation_error.message,
                title: "Ошибка валидации",
                autoRender: false,
            };
            const modal: Modal = new Modal(modal_props);
            modal.open();
            return;
        }
        const response = await update_profile(email_value, first_name_value, last_name_value, important_types_value);
        if (!response.success) {
            const modal_props: ModalProps = {
                message: response.data.message,
                title: "Ошибка",
                autoRender: false,
            };
            const modal: Modal = new Modal(modal_props);
            modal.open();
            return;
        }
        router.navigate("/");
    }
}
