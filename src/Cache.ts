export class Cache<TValue, TKey = string> {

    /**
     * Holds the cached values
     */
    private readonly map: Map<TKey, TValue> = new Map<TKey, TValue>();

    /**
     * Holds the track of when the key was last used, the higher value means the key was used more recently
     */
    private readonly lastUsedMap: Map<TKey, number> = new Map<TKey, number>();

    /**
     * Used by lastUsedMap. The value should be equal to the sum of get and set calls
     */
    private counter: number = 0;

    constructor(private maxSize: number = 1000) {
    }

    public reset(): void {
        this.map.clear();
        this.lastUsedMap.clear();
        this.counter = 0;
    }

    public set(key: TKey, value: TValue): void {
        this.map.set(key, value);

        this.trackRecentlyAccessed(key);

        if (this.map.size > this.maxSize) {
            this.discardLeastRecentlyAccessed();
        }
    }

    private discardLeastRecentlyAccessed() {
        let minKey: TKey | undefined;
        let minValue: number = Number.MAX_SAFE_INTEGER;

        this.lastUsedMap.forEach((value, key) => {
            if (value < minValue) {
                minValue = value;
                minKey = key;
            }
        });

        if (minKey) {
            this.map.delete(minKey);
            this.lastUsedMap.delete(minKey);
        }
    }

    public get(key: TKey, source?: () => TValue): TValue {
        if (!this.map.has(key) && source) {
            const value = source();
            this.set(key, value);
            return value;
        }

        if (this.map.has(key)) { // Keep track of when the key was last used and remove the least recently used key when the cache is full
            this.trackRecentlyAccessed(key);
        }

        return this.map.get(key);
    }

    private trackRecentlyAccessed(key: TKey) {
        this.lastUsedMap.set(key, this.counter++);
    }
}