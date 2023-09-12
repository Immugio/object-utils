function defaultIncludesFunc<T>(array: T[], b: T) {
    return array.includes(b);
}

export function unique<T>(arr: T[], includesFunction: (array: T[], b: T) => boolean = defaultIncludesFunc): T[] {
    const result: T[] = [];
    for (let i = 0; i < arr.length; i++) {
        if (!includesFunction(result, arr[i])) {
            result.push(arr[i]);
        }
    }
    return result;
}

export function pushUnique<T>(arr: T[], value: T, includesFunction: (array: T[], b: T) => boolean = defaultIncludesFunc): T[] {
    if (!includesFunction(arr, value)) {
        arr.push(value);
    }
    return arr;
}