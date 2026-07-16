export function parseToNumber(str, defaultValue) {
    if (!str)
        return defaultValue;
    if (Number.isNaN(Number(str)))
        return defaultValue;
    return Number(str);
}
