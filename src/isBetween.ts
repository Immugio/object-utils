export function isBetween(n: number, a: number, b: number): boolean {
    return (a < n && n < b) || (a > n && n > b);
}