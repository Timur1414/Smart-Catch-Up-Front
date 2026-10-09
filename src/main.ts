import "./style.css";
import "./utils/helpers.ts";
import {Router} from "./router/router.ts";
import {HomePage} from "./pages/Home/home.ts";
import {MainMenu} from "./components/MainMenu/main_menu.ts";
import {NotFoundPage} from "./pages/NotFound/not_found.ts";
import {LoginPage} from "./pages/Login/login.ts";
import {RegisterPage} from "./pages/Register/register.ts";
import {AdminPage} from "./pages/Admin/admin.ts";
import {ProfilePage} from "./pages/Profile/profile.ts";
import {get_allowed_user_ids} from "./api/profile.ts";
import {set_allowed_notification_types, set_allowed_user_ids} from "./store/store.ts";
import {get_allowed_notification_types} from "./api/notifications.ts";

const root: HTMLElement = document.getElementById("app") as HTMLElement;
export const router = new Router(root);

router.addRoute("/", () => new HomePage())
    .addRoute("/login", () => new LoginPage())
    .addRoute("/register", () => new RegisterPage())
    .addRoute("/admin", () => new AdminPage())
    .addRoute("/profile", () => new ProfilePage())
    .addRoute("/404", () => new NotFoundPage());

async function load_store(): Promise<void> {
    set_allowed_user_ids(await get_allowed_user_ids());
    set_allowed_notification_types(await get_allowed_notification_types());
}

async function init(): Promise<void> {
    let menu: MainMenu = new MainMenu({
        url: import.meta.env.VITE_ADVERTISEMENT_URL,
    });
    let menu_root: HTMLElement = document.getElementById("menu")!;
    menu.render(menu_root);
    await load_store();
    router.start();
}

init();
