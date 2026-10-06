export interface NotificationObject {
    id: number;
    img: string;
    actor: string;
    date: string;
    payload: string;
    actions: {
        action_type: string;
        action_target: string;
    }[];
}

export interface UserObject {
    email: string;
    created_at: string;
    avatar_url: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
}
