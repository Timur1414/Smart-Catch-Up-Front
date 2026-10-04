import { client } from "./client.ts";

export const login = async (): Promise<boolean> => {};

export const logout = async (): Promise<boolean> => {
    try {
        const response: Response = await client("/auth/logout", {
            method: "POST",
        });
        const data: any = await response.json();
        return data.code === 200;
    }
    catch {
        return false;
    }
};

export const check_login = async (): Promise<boolean> => {};
