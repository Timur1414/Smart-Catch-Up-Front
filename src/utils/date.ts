const rtf = new Intl.RelativeTimeFormat("ru", { numeric: "always" });

export function formatRelativeTime(date_input: string | number | Date): string {
    if (!date_input)
        return "";
    const date: Date = typeof date_input === "string" || typeof date_input === "number"
        ? new Date(date_input)
        : date_input;
    if (isNaN(date.getTime()))
        return String(date_input);

    const now: number = Date.now();
    const diff_in_seconds: number = Math.floor((now - date.getTime()) / 1000);
    if (diff_in_seconds < 5)
        return "только что";
    if (diff_in_seconds < 60)
        return rtf.format(-diff_in_seconds, "second");
    const diff_in_minutes: number = Math.floor(diff_in_seconds / 60);
    if (diff_in_minutes < 60)
        return rtf.format(-diff_in_minutes, "minute");
    const diff_in_hours: number = Math.floor(diff_in_minutes / 60);
    if (diff_in_hours < 24)
        return rtf.format(-diff_in_hours, "hour");
    const diff_in_days: number = Math.floor(diff_in_hours / 24);
    if (diff_in_days < 7)
        return rtf.format(-diff_in_days, "day");
    const diff_in_weeks: number = Math.floor(diff_in_days / 7);
    if (diff_in_days < 30)
        return rtf.format(-diff_in_weeks, "week");
    const diff_in_months: number = Math.floor(diff_in_days / 30);
    if (diff_in_months < 12)
        return rtf.format(-diff_in_months, "month");
    const diff_in_years: number = Math.floor(diff_in_days / 365);
    return rtf.format(-diff_in_years, "year");
}
