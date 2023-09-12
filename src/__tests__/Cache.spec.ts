import { Cache } from "../Cache";

describe("Cache", () => {
    it("should set a value with a key and retrieve it successfully", () => {
        const cache = createCache<number>();
        const key = "key";
        const value = 10;

        cache.set(key, value);

        expect(cache.get(key)).toBe(value);

        expect(cache.lastUsedMap.get(key)).toBe(1);
        expect(cache.map.get(key)).toBe(value);

        expect(cache.map.size).toBe(1);
        expect(cache.lastUsedMap.size).toBe(1);

        expect(cache.counter).toBe(2);
    });

    it("should set multiple values with different keys and retrieve them successfully", () => {
        const cache = createCache<number>();

        const key1 = "key1";
        const value1 = 10;
        cache.set(key1, value1);

        const key2 = "key2";
        const value2 = 20;
        cache.set(key2, value2);

        expect(cache.get(key2)).toBe(value2);
        expect(cache.get(key1)).toBe(value1);

        expect(cache.lastUsedMap.get(key1)).toBe(3); // Key1 was created first but has the highest counter value as it was accessed last
        expect(cache.lastUsedMap.get(key2)).toBe(2);

        expect(cache.map.size).toBe(2);
        expect(cache.lastUsedMap.size).toBe(2);

        expect(cache.counter).toBe(4);
    });

    it("should set a value with a key that already exists and overwrite it successfully", () => {
        const cache = createCache<number>();
        const key = "key";
        const value1 = 10;
        const value2 = 20;

        cache.set(key, value1);
        cache.set(key, value2);

        expect(cache.get(key)).toBe(value2);
        expect(cache.map.size).toBe(1);
        expect(cache.lastUsedMap.size).toBe(1);

        expect(cache.counter).toBe(3);
    });

    it("should reset the cache and verify it is empty", () => {
        const cache = createCache<number>();
        const key = "key";
        const value = 10;

        cache.set(key, value);
        cache.reset();

        expect(cache.get(key)).toBeUndefined();
        expect(cache.map.size).toBe(0);
        expect(cache.lastUsedMap.size).toBe(0);
        expect(cache.counter).toBe(0);
    });

    it("should add a value with an undefined key to the cache", () => {
        const cache = createCache<number>();
        const key = undefined;
        const value = 10;

        cache.set(key, value);

        expect(cache.get(key)).toBe(value);
        expect(cache.map.size).toBe(1);
        expect(cache.lastUsedMap.size).toBe(1);

        expect(cache.counter).toBe(2);
    });

    it("should add a value with a null key to the cache", () => {
        const cache = createCache<number>();
        const key = null;
        const value = 10;

        cache.set(key, value);

        expect(cache.get(key)).toBe(value);
        expect(cache.map.size).toBe(1);
        expect(cache.lastUsedMap.size).toBe(1);

        expect(cache.counter).toBe(2);
    });

    it("should add a value with an empty string key to the cache", () => {
        const cache = createCache<number>();
        const key = "";
        const value = 10;

        cache.set(key, value);

        expect(cache.get(key)).toBe(value);
        expect(cache.map.size).toBe(1);
        expect(cache.lastUsedMap.size).toBe(1);

        expect(cache.counter).toBe(2);
    });

    it("should discard the least recently accessed value when the cache exceeds the maximum size", () => {
        const maxSize = 2;
        const cache = createCache<number>(maxSize);

        const key1 = "key1";
        const value1 = 10;
        cache.set(key1, value1);

        const key2 = "key2";
        const value2 = 20;
        cache.set(key2, value2);

        const key3 = "key3";
        const value3 = 30;
        cache.set(key3, value3);

        expect(cache.map.size).toBe(maxSize);
        expect(cache.lastUsedMap.size).toBe(maxSize);

        expect(cache.get(key1)).toBeUndefined();

        expect(cache.get(key2)).toBe(value2);
        expect(cache.map.get(key2)).toBe(value2);

        expect(cache.get(key3)).toBe(value3);
        expect(cache.map.get(key3)).toBe(value3);

        expect(cache.counter).toBe(5);
    });

    it("should create an entry from callback if entry doesn't exists", () => {
        const cache = createCache<string>();
        const key = "key";

        expect(cache.get(key)).toBeUndefined();
        expect(cache.map.size).toBe(0);
        expect(cache.lastUsedMap.size).toBe(0);
        expect(cache.counter).toBe(0);

        const valueFromCallback = "valueFromCallback";
        expect(cache.get(key, () => valueFromCallback)).toBe(valueFromCallback);
        expect(cache.map.size).toBe(1);
        expect(cache.lastUsedMap.size).toBe(1);
        expect(cache.counter).toBe(1);
    });
});

/**
 * Only used for testing to cast the Cache class to the ICache interface
 * so that we can test fields that are private in the Cache class
 */
interface ICache<TValue, TKey = string> {
    map: Map<TKey, TValue>;
    lastUsedMap: Map<TKey, number>;
    counter: number;
    maxSize: number;

    reset(): void;
    set(key: TKey, value: TValue): void;
    discardLeastRecentlyAccessed(): void;
    get(key: TKey, source?: () => TValue): TValue;
}

function createCache<TValue, TKey = string>(maxSize?: number): ICache<TValue, TKey> {
    return new Cache<TValue, TKey>(maxSize) as unknown as ICache<TValue, TKey>;
}
