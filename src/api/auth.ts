import {client} from "./client.ts";
import {
    LoginSuccessResponse, LogoutSuccessResponse, RegisterErrorResponse, RegisterSuccessResponse,
    ServerErrorResponse, SimpleResponse,
    TooManyRequestsResponse,
    UnauthorizedResponse
} from "../types/responses_interfaces.ts";

export const login = async (email: string, password: string): Promise<{
    success: boolean,
    code: number,
    data: ServerErrorResponse | LoginSuccessResponse | TooManyRequestsResponse | UnauthorizedResponse
}> => {
    try {
        const response: Response = await client("/auth/login", {
            method: "POST",
            body: JSON.stringify({email, password}),
        });
        const data: LoginSuccessResponse | ServerErrorResponse | TooManyRequestsResponse | UnauthorizedResponse = await response.json();
        const success: boolean = data.code === 200;
        return {success: success, code: data.code, data: data};
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

export const register = async (email: string, password: string, confirm_password: string): Promise<{
    success: boolean,
    code: number,
    data: RegisterSuccessResponse | RegisterErrorResponse | ServerErrorResponse
}> => {
    try {
        const response: Response = await client("/auth/register", {
            method: "POST",
            body: JSON.stringify({email, password, confirm_password}),
        });
        const data: RegisterSuccessResponse | RegisterErrorResponse | ServerErrorResponse = await response.json();
        const success: boolean = data.code === 200;
        return {success: success, code: data.code, data: data};
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

export const refresh = async (): Promise<{
    success: boolean,
    code: number,
    data: SimpleResponse | UnauthorizedResponse | ServerErrorResponse
}> => {
    try {
        const response: Response = await client("/auth/refresh", { method: "POST" });
        const data: SimpleResponse | UnauthorizedResponse | ServerErrorResponse = await response.json();
        const success: boolean = data.code === 200;
        return {success: success, code: data.code, data: data};
    }
    catch (error) {
        console.error("Failed to refresh token:", error);
        const data: ServerErrorResponse  = {
            code: 0,
            message: "Network error",
            request_id: "",
        };
        return {success: false, code: 0, data: data};
    }
};

export const logout = async (): Promise<{
    success: boolean,
    code: number,
    data: LogoutSuccessResponse | UnauthorizedResponse | ServerErrorResponse
}> => {
    try {
        const response: Response = await client("/auth/logout", {
            method: "POST",
        });
        const data: LogoutSuccessResponse | UnauthorizedResponse | ServerErrorResponse = await response.json();
        const success: boolean = data.code === 200;
        return {success: success, code: data.code, data: data};
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

export const check_login = async (): Promise<boolean> => {
    try {
        let response: Response = await client("/profile", {
            method: "GET",
        });
        if (response.status === 401) {
            const is_refreshed = await refresh();
            if (!is_refreshed.success)
                return false;
            response = await client("/profile", { method: "GET" });
        }
        return response.ok;
    }
    catch (error) {
        return false;
    }
};
