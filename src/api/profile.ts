import {ProfileResponse, ServerErrorResponse, UnauthorizedResponse} from "../types/responses_interfaces.ts";
import {client} from "./client.ts";
import {refresh} from "./auth.ts";

export const get_profile = async (): Promise<{ success: boolean, code: number, data: ProfileResponse | UnauthorizedResponse | ServerErrorResponse }> => {
    try {
        let response: Response = await client("/profile", {method: "GET"});
        if (response.status === 401) {
            const is_refreshed = await refresh();
            if (!is_refreshed.success) {
                const data: UnauthorizedResponse = await response.json();
                return {success: false, code: data.code, data: data};
            }
            response = await client("/profile", {method: "GET"});
        }
        if (!response.ok) {
            const data: ServerErrorResponse = await response.json();
            return {success: false, code: data.code, data: data};
        }
        const data: ProfileResponse = await response.json();
        return {success: true, code: 200, data: data};
    }
    catch (error) {
        const data: ServerErrorResponse = {
            code: 0,
            message: "Network error",
            request_id: "",
        };
        return {success: false, code: 0, data: data};
    }
};
