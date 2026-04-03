export const record = function<K extends string | number | symbol, V>(
	init?: ReadonlyArray<[key: K, value: V]>,
): Record<K, V> {
	const newRecord = Object.create(null) as Record<K, V>
	if (init) {
		for (const [ k, v ] of init) {
			newRecord[k] = v
		}
	}
	return newRecord
}
