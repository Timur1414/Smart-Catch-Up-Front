import {ShortUserObject} from "../types/objects_interfaces.ts";

let allowed_user_ids: ShortUserObject[] = [];

export function set_allowed_user_ids(user_ids: ShortUserObject[]): void {
    allowed_user_ids = user_ids;
}

export function get_allowed_user_ids(): ShortUserObject[] {
    return allowed_user_ids;
}

let allowed_notification_types: string[] = [];

export function set_allowed_notification_types(notification_types: string[]): void {
    if (allowed_notification_types.length > 0)
        return;
    allowed_notification_types = notification_types;
}

export function get_allowed_notification_types(): string[] {
    return allowed_notification_types;
}
