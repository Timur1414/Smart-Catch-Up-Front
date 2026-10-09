import {NotificationActionObject, NotificationObject} from "./objects_interfaces.ts";

export interface NotificationsProps {
    notifications: NotificationObject[];
}

export interface DigestCategoryProps {
    header: string;
    content: string;
}

export interface MainMenuProps {
    url: string;
}

export interface ModalProps {
    message?: string;
    title?: string;
    buttonText?: string;
    onClose?: () => void;
    container?: HTMLElement;
    autoRender?: boolean;
}

export interface MultiSelectOption {
    value: string | number;
    label: string;
    isSelected?: boolean;
}

export interface MultiSelectInputProps {
    name?: string;
    label?: string;
    placeholder?: string;
    options: (MultiSelectOption | string | number)[];
    selectedValues?: (string | number)[] | null;
    disabled?: boolean;
    error?: string;
    onChange?: (values: string[], options: MultiSelectOption[]) => void;
}

export interface NotificationProps {
    img: string;
    actor: string;
    date: string;
    payload: string;
    actions: NotificationActionObject[];
}

export interface ProfileAvatarProps {
    url: string;
}

export interface ProfileEditProps {
    email: string;
    first_name: string;
    last_name: string;
}

export interface SelectOption {
    value: string | number;
    label: string;
    isSelected?: boolean;
}

export interface SelectInputProps {
    name?: string;
    label?: string;
    placeholder?: string;
    options: (SelectOption | string | number)[];
    selectedValue?: string | number | null;
    disabled?: boolean;
    error?: string;
    onChange?: (value: string, option: SelectOption | null) => void;
}
