export function hasFlag(value: number, ...flags: number[]): boolean {
    return flags.some(f => (value & f) === f);
}

export function excludesFlags(value: number, ...flags: number[]): boolean {
    return !hasFlag(value, ...flags);
}