export function validate_email(email: string): {ok: boolean, message: string} {
    if (email.length == 0 || email.length >= 255)
        return {ok: false, message: "Некорректная длина почты"};
    const ok: boolean = /^[A-Za-zа-яёА-ЯЁ0-9._%+-]+@[A-Za-zа-яёА-ЯЁ0-9.-]+\.[A-Za-zа-яёА-ЯЁ]{2,}$/.test(email);
    if (!ok)
        return {ok: false, message: "Некорректная почта"};
    return {ok: true, message: ""};
}

export function validate_password(password: string): {ok: boolean, message: string} {
    let has_lower: boolean = false,
        has_upper: boolean = false,
        has_digit: boolean = false,
        has_invalid: boolean = false;
    for (const symbol of password) {
        if ("a" <= symbol && symbol <= "z") has_lower = true;
        else if ("A" <= symbol && symbol <= "Z") has_upper = true;
        else if ("0" <= symbol && symbol <= "9") has_digit = true;
        else has_invalid = true;
    }
    if (password.length < 8 || !has_upper || !has_lower || !has_digit || has_invalid)
        return {ok: false, message: "Пароль должен содержать заглавные и строчные буквы латинского алфавита и цифры (не менее 8 символов)"};
    return {ok: true, message: ""};
}

export function validate_passwords_equal(password: string, confirm_password: string): {ok: boolean, message: string} {
    if (password !== confirm_password)
        return {ok: false, message: "Пароли не совпадают"};
    return {ok: true, message: ""};
}

export function validate_not_empty(text: string): {ok: boolean, message: string} {
    if (text === "")
        return {ok: false, message: "Поле не может быть пустым"};
    return {ok: true, message: ""};
}

export function validate_min_value(count: string): {ok: boolean, message: string} {
    const count_int: number = Number(count);
    if (isNaN(count_int) || count_int <= 0)
        return {ok: false, message: "Значение должно быть положительным"};
    return {ok: true, message: ""};
}

export function validate_notification_type(type: string): {ok: boolean, message: string} {
    if (!["friend_request", "b", "c"].includes(type))
        return {ok: false, message: "Тип уведомления не поддерживается"};
    return {ok: true, message: ""};
}

export function validate_notification_types(types: string[]): {ok: boolean, message: string} {
    for (const type of types)
        if (!["friend_request", "b", "c"].includes(type))
            return {ok: false, message: "Тип уведомления не поддерживается"};
    return {ok: true, message: ""};
}

export function validate_user_id(user: string): {ok: boolean, message: string} {
    const user_id: number = Number(user);
    if (isNaN(user_id) || user_id <= 0)
        return {ok: false, message: "Неверный Id пользователя"};
    return {ok: true, message: ""};
}

export function validate_user_ids(users: string[]): {ok: boolean, message: string} {
    for (const user of users) {
        const user_id: number = Number(user);
        if (isNaN(user_id) || user_id <= 0)
            return {ok: false, message: "Неверный Id пользователя"};
    }
    return {ok: true, message: ""};
}
