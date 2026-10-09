import {NotificationObject, ShortUserObject} from "./objects_interfaces.ts";

export interface SimpleResponse {
    code: number;
    message: string;
}

export interface UuidResponse extends SimpleResponse {
    request_id: string;
}

export interface TooManyRequestsResponse extends UuidResponse {
    code: 429;
}

export interface ValidationErrorResponse extends UuidResponse {
    code: 400;
    errors: {
        field: string;
        message: string;
    }[];
}

export interface ForbiddenResponse extends UuidResponse {
    code: 403;
}

export interface UnauthorizedResponse extends UuidResponse {
    code: 401;
}

export interface ServerErrorResponse extends UuidResponse {
    code: 500 | 0;
}

export interface LoginSuccessResponse extends UuidResponse {
    code: 200;
}

export interface LoginErrorResponse extends ValidationErrorResponse {}

export interface RegisterSuccessResponse extends UuidResponse {}

export interface RegisterErrorResponse {
    code: 400 | 409;
    message: string,
    errors: {
        field: string;
        message: string;
    }[];
}

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
    notifications: NotificationObject[];
}

export interface AllowedUserIdsResponse extends UuidResponse {
    users: ShortUserObject[];
}

export interface AllowedNotificationTypesResponse extends UuidResponse {
    types: string[];
}
