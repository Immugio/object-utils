type DebouncedFunction<T extends unknown[]> = (...args: T) => void;

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds or after maxWait milliseconds, whichever comes first.
 * If `immediate` is passed, trigger the function on the leading edge, instead of the trailing.
 * @param func
 * @param wait
 * @param immediate
 * @param maxWait
 */
export function debounce<T extends unknown[]>(
    func: (...args: T) => void,
    wait: number,
    immediate?: boolean,
    maxWait?: number
): DebouncedFunction<T> {
    let timeout: NodeJS.Timeout | null = null;
    let maxTimeoutId: NodeJS.Timeout | null = null;
    let argsCache: T | null = null;

    const later = () => {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }

        if (!immediate && argsCache) {
            func(...argsCache);
            argsCache = null;
        }

        if (maxTimeoutId) {
            clearTimeout(maxTimeoutId);
            maxTimeoutId = null;
        }
    };

    return (...args: T) => {
        argsCache = args;

        if (!timeout && !maxTimeoutId) {
            if (immediate) {
                func(...args);
                argsCache = null;
            }

            timeout = setTimeout(later, wait);

            if (maxWait !== undefined) {
                maxTimeoutId = setTimeout(later, maxWait);
            }
        } else {
            if (timeout) {
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            }
        }
    };
}
