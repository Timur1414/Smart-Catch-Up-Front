import './style.css'
import {Router} from "./router/router.ts";
import {HomePage} from "./pages/Home/home.ts";

const root: HTMLElement = document.getElementById('app') as HTMLElement;
export const router = new Router(root);

router.addRoute("/", () => new HomePage());

async function init(): Promise<void> {
    router.start();
}

init();
