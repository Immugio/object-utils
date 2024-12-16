export type ItemsGroup<TItem, TKey> = { key: TKey, items: TItem[] };

export function groupBy<TItem, TKey>(arr: TItem[], getKey: (item: TItem) => TKey): ItemsGroup<TItem, TKey>[] {
    const result: ItemsGroup<TItem, TKey>[] = [];
    for (const item of arr) {
        const key = getKey(item);
        const group = result.find(g => g.key === key);
        if (!group) {
            result.push({ key, items: [item] });
        } else {
            group.items.push(item);
        }
    }
    return result;
}
