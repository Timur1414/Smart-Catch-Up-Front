export interface SimpleResponse {
    code: number;
    message: string;
}

export interface UuidResponse extends SimpleResponse {
    request_id: string;
}

export interface ValidationErrorResponse extends UuidResponse {
    errors: {
        field: string;
        message: string;
    }[];
}

export interface ForbiddenResponse extends UuidResponse {}

export interface UnauthorizedResponse extends UuidResponse {}

export interface ServerErrorResponse extends UuidResponse {}

export interface LoginSuccessResponse extends UuidResponse {}

export interface LoginErrorResponse extends ValidationErrorResponse {}

export interface RegisterSuccessResponse extends UuidResponse {}

export interface RegisterErrorResponse extends ValidationErrorResponse {}

export interface LogoutSuccessResponse extends UuidResponse {}

export interface ProfileResponse extends UuidResponse {
    email: string;
    created_at: string;
    avatar_url: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
}

export interface UserRoleResponse extends UuidResponse {
    is_staff: boolean;
}

export interface DigestResponse extends UuidResponse {
    created_at: string;
    important: {
        notification: string;
        timestamp: string;
    }[];
    categories: {
        category_type: string;
        text: string;
    }[];
}

export interface NotificationsResponse extends UuidResponse {
    notifications: {
        id: number;
        img: string;
        actor: string;
        date: string;
        payload: string;
        actions: {
            action_type: string;
            action_target: string;
        }[];
    }[];
}
