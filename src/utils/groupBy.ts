import { record } from "./record"

export const groupBy = function <T, K extends string | number | symbol>(
	items: ReadonlyArray<T>,
	keyFn: (item: T) => K,
): Record<K, Array<T>> {
	return items.reduce((acc, item) => {
		const key = keyFn(item)
		/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition --
		 * First-time assignment
		 */
		; (acc[key] ??= []).push(item)
		return acc
	}, record<K, Array<T>>())
}
