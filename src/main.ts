import './style.css'
import {Router} from "./router/router.ts";
import {BasePage} from "./pages/base_page.ts";

const root: HTMLElement = document.getElementById('app') as HTMLElement;
export const router = new Router(root);

router.addRoute("/404", () => new BasePage());

async function init(): Promise<void> {
    router.start();
}

init();
