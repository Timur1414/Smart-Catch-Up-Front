import {NotificationsResponse, ServerErrorResponse, UnauthorizedResponse} from "../types/responses_interfaces.ts";
import {client} from "./client.ts";
import {refresh} from "./auth.ts";

export const get_notifications = async () => {
    return await get_notifications_client("/notifications");
};

export const get_all_notifications = async () => {
    return await get_notifications_client("/notifications/all");
};

const get_notifications_client = async (url: string): Promise<{success: boolean, code: number, data: NotificationsResponse | ServerErrorResponse | UnauthorizedResponse}> => {
    try {
        let response: Response = await client(url, {method: "GET"});
        if (response.status === 401) {
            const is_refreshed = await refresh();
            if (!is_refreshed.success) {
                const data: UnauthorizedResponse = await response.json();
                return {success: false, code: 401, data: data};
            }
            response = await client(url, {method: "GET"});
        }
        const data: NotificationsResponse | ServerErrorResponse = await response.json();
        return {success: true, code: data.code, data: data};
    }
    catch (error: any) {
        const data: ServerErrorResponse = {
            code: 0,
            message: "Network error",
            request_id: "",
        }
        return { success: false, code: 0, data: data };
    }
};
