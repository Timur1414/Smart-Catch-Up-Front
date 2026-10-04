import {client} from "./client.ts";
import {
    LoginSuccessResponse,
    ServerErrorResponse,
    TooManyRequestsResponse,
    UnauthorizedResponse
} from "../types/interfaces.ts";

export const login = async (email: string, password: string): Promise<{ success: boolean, message: string }> => {
    try {
        const response: Response = await client("/auth/login", {
            method: "POST",
            body: JSON.stringify({email, password}),
        });
        const data: LoginSuccessResponse | ServerErrorResponse | TooManyRequestsResponse | UnauthorizedResponse = await response.json();
        if (data.code === 200)
            return {success: true, message: data.message};
        return {success: false, message: data.message};
    }
    catch {
        return {success: false, message: "Network error"};
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
    catch {
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
            if (is_refreshed)
                response = await client("/profile", { method: "GET" });
            else
                return false;
        }
        return response.ok;
    }
    catch {
        return false;
    }
};
