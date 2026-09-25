import './style.css'
import {Router} from "./router/router.ts";
import {HomePage} from "./pages/Home/home.ts";
import {MainMenu} from "./components/MainMenu/main_menu.ts";
import {NotFoundPage} from "./pages/NotFound/not_found.ts";
import {LoginPage} from "./pages/Login/login.ts";
import {RegisterPage} from "./pages/Register/register.ts";
import {AdminPage} from "./pages/Admin/admin.ts";
import {ProfilePage} from "./pages/Profile/profile.ts";

const root: HTMLElement = document.getElementById("app") as HTMLElement;
export const router = new Router(root);

router.addRoute("/", () => new HomePage())
    .addRoute("/login", () => new LoginPage())
    .addRoute("/register", () => new RegisterPage())
    .addRoute("/admin", () => new AdminPage())
    .addRoute("/profile", () => new ProfilePage())
    .addRoute("/404", () => new NotFoundPage());

async function init(): Promise<void> {
    let menu: MainMenu = new MainMenu({});
    let menu_root: HTMLElement = document.getElementById("menu")!;
    menu.render(menu_root);

    router.start();
}

init();
