import {client} from "./client.ts";
import {
    LoginSuccessResponse,
    ServerErrorResponse,
    TooManyRequestsResponse,
    UnauthorizedResponse
} from "../types/interfaces.ts";

export const login = async (email: string, password: string): Promise<{ success: boolean, code: number, message: string }> => {
    try {
        const response: Response = await client("/auth/login", {
            method: "POST",
            body: JSON.stringify({email, password}),
        });
        const data: LoginSuccessResponse | ServerErrorResponse | TooManyRequestsResponse | UnauthorizedResponse = await response.json();
        const success: boolean = data.code === 200;
        return {success: success, code: data.code, message: data.message};
    }
    catch (error) {
        return {success: false, code: 0, message: "Network error"};
    }
};

export const refresh = async (): Promise<boolean> => {
    try {
        const response: Response = await client("/auth/refresh", { method: "POST" });
        return response.ok;
    }
    catch (error) {
        console.error("Failed to refresh token:", error);
        return false;
    }
};

export const logout = async (): Promise<boolean> => {
    try {
        const response: Response = await client("/auth/logout", {
            method: "POST",
        });
        return response.ok;
    }
    catch (error) {
        return false;
    }
};

export const check_login = async (): Promise<boolean> => {
    try {
        let response: Response = await client("/profile", {
            method: "GET",
        });
        if (response.status === 401) {
            const is_refreshed: boolean = await refresh();
            if (!is_refreshed)
                return false;
            response = await client("/profile", { method: "GET" });
        }
        return response.ok;
    }
    catch (error) {
        return false;
    }
};
