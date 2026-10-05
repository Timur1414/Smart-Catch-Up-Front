import {client} from "./client.ts";
import {refresh} from "./auth.ts";
import {
    ForbiddenResponse,
    ServerErrorResponse,
    UnauthorizedResponse,
    ValidationErrorResponse
} from "../types/interfaces.ts";

export const generate_1 = async (notification_type: string, test: string, user_id: number): Promise<{success: boolean, code: number, message: string}> => {
    const body: string = JSON.stringify({notification_type, test, user_id});
    return await generate_client("/admin/generate", body);
};

export const generate_n = async (notification_types: string[], number: number, user_ids: number[]): Promise<{success: boolean, code: number, message: string}> => {
    const body: string = JSON.stringify({notification_types, number, user_ids});
    return await generate_client("/admin/generate_n", body);
};

const generate_client = async (url: string, body: string): Promise<{success: boolean, code: number, message: string}> => {
    try {
        let response: Response = await client(url, {
            method: "POST",
            body: body,
        });
        if (response.status === 401) {
            const is_refreshed: boolean = await refresh();
            if (!is_refreshed) {
                const data: UnauthorizedResponse = await response.json();
                return {success: false, code: data.code, message: data.message};
            }
            response = await client(url, {
                method: "POST",
                body: body,
            });
        }
        if (!response.ok) {
            const data: ValidationErrorResponse | ForbiddenResponse | ServerErrorResponse = await response.json();
            return {success: false, code: data.code, message: data.message};
        }
        return {success: true, code: 200, message: "Ok"};
    }
    catch (error: any) {
        return {success: false, code: 0, message: "Network error"};
    }
};