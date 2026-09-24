import {BasePage} from "../base_page.ts";
import template from "./register.hbs?raw";
import "./register.css";
import Handlebars from "handlebars";
import {RegisterForm} from "../../components/RegisterForm/register_form.ts";


export class RegisterPage extends BasePage {
    async render(root: HTMLElement): Promise<void> {
        let compiledTemplate = Handlebars.compile(template);
        root.innerHTML = compiledTemplate({}).trim();

        let register_form: RegisterForm = new RegisterForm({});
        let form_root: HTMLElement | null = root.querySelector<HTMLElement>(".register_container");
        if (!form_root)
            return;
        register_form.render(form_root);
    }
}
