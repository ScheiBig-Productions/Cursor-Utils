export const groupBy = function <T, K extends string | number | symbol>(
	items: ReadonlyArray<T>,
	keyFn: (item: T) => K,
): Record<K, Array<T>> {
	return items.reduce<Record<K, Array<T>>>((acc, item) => {
		const key = keyFn(item)
		/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition --
		 * First-time assignment
		 */
		; (acc[key] ??= []).push(item)
		return acc
		/* eslint-disable-next-line @typescript-eslint/no-unsafe-argument --
		 * Dynamic object building
		 */
	}, Object.create(null))
}
