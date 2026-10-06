import {client} from "./client.ts";
import {refresh} from "./auth.ts";
import {
    ForbiddenResponse,
    ServerErrorResponse, SimpleResponse,
    UnauthorizedResponse,
    ValidationErrorResponse
} from "../types/responses_interfaces.ts";

export const generate_1 = async (notification_type: string, text: string, user_id: number): Promise<{success: boolean, code: number, data: SimpleResponse | ValidationErrorResponse | ForbiddenResponse | ServerErrorResponse | UnauthorizedResponse}> => {
    const body: string = JSON.stringify({notification_type, test: text, user_id});
    return await generate_client("/admin/generate", body);
};

export const generate_n = async (notification_types: string[], number: number, user_ids: number[]): Promise<{success: boolean, code: number, data: SimpleResponse | ValidationErrorResponse | ForbiddenResponse | ServerErrorResponse | UnauthorizedResponse}> => {
    const body: string = JSON.stringify({notification_types, number, user_ids});
    return await generate_client("/admin/generate_n", body);
};

const generate_client = async (url: string, body: string): Promise<{success: boolean, code: number, data: SimpleResponse | ValidationErrorResponse | ForbiddenResponse | ServerErrorResponse | UnauthorizedResponse}> => {
    try {
        let response: Response = await client(url, {
            method: "POST",
            body: body,
        });
        if (response.status === 401) {
            const is_refreshed = await refresh();
            if (!is_refreshed.success) {
                const data: UnauthorizedResponse = await response.json();
                return {success: false, code: data.code, data: data};
            }
            response = await client(url, {
                method: "POST",
                body: body,
            });
        }
        if (!response.ok) {
            const data: ValidationErrorResponse | ForbiddenResponse | ServerErrorResponse = await response.json();
            return {success: false, code: data.code, data: data};
        }
        const data: SimpleResponse = await response.json();
        return {success: true, code: 200, data: data};
    }
    catch (error: any) {
        const data: ServerErrorResponse = {
            code: 0,
            message: "Network error",
            request_id: "",
        }
        return {success: false, code: 0, data: data};
    }
};
