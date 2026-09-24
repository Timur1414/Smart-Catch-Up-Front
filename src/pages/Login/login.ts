import {BasePage} from "../base_page.ts";
import template from "./login.hbs?raw";
import "./login.css";
import Handlebars from "handlebars";
import {LoginForm} from "../../components/LoginForm/login_form.ts";

export class LoginPage extends BasePage {
    async render(root: HTMLElement): Promise<void> {
        let compiledTemplate = Handlebars.compile(template);
        root.innerHTML = compiledTemplate({}).trim();

        let login_form: LoginForm = new LoginForm({});
        let form_root: HTMLElement | null = root.querySelector<HTMLElement>(".login_container");
        if (!form_root)
            return;
        login_form.render(form_root);
    }
}
