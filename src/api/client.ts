import {get_csrf_token} from "./csrf.ts";

export const SERVER_URL: string = import.meta.env.VITE_SERVER_URL;
export const CSRF_HEADER_NAME: string = "X-CSRF-Token";

export const client = (url: string, data: RequestInit={}): Promise<Response> => {
    let csrf_token: string | null = get_csrf_token();
    if (!csrf_token)
        csrf_token = "";
    const options: RequestInit = {
        credentials: "include",
        ...data,
        headers: {
            ...data.headers,
            [CSRF_HEADER_NAME]: csrf_token,
        }
    };
    return fetch(SERVER_URL + url, options);
};
