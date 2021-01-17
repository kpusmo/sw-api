export const randomInRange = n => Math.floor(Math.random() * n);

export function* range(n: number, step?: number) {
    const negative = n < 0;
    if (!step) {
        step = negative ? -1 : 1;
    }
    for (let i = negative ? n : 0; i < n; i += step) {
        yield i;
    }
}
