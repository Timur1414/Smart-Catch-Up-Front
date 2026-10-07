import {AllowedUserIdsResponse, ProfileResponse, ServerErrorResponse, UnauthorizedResponse} from "../types/responses_interfaces.ts";
import {client} from "./client.ts";
import {refresh} from "./auth.ts";
import {ShortUserObject} from "../types/objects_interfaces.ts";

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

export const get_allowed_user_ids = async (): Promise<ShortUserObject[]> => {
    try {
        let response: Response = await client("/users_ids", {method: "GET"});
        if (response.status === 401) {
            const is_refreshed = await refresh();
            if (!is_refreshed.success)
                return [];
            response = await client("/users_ids", {method: "GET"});
        }
        const data: AllowedUserIdsResponse = await response.json();
        return data.users;
    }
    catch (error) {
        console.log(error);
        return [];
    }
};
