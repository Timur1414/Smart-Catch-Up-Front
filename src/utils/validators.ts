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
    if (password.trim() !== confirm_password.trim())
        return {ok: false, message: "Пароли не совпадают"};
    return {ok: true, message: ""};
}
