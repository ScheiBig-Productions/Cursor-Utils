export const zip = function* <T1, T2>(
	first: Iterable<T1> | Iterator<T1>,
	second: Iterable<T2> | Iterator<T2>,
): Generator<[first: T1, second: T2], void, unknown> {
	const firstIter = Symbol.iterator in first
		? first[Symbol.iterator]()
		: first
	const secondIter = Symbol.iterator in second
		? second[Symbol.iterator]()
		: second

	for (; ;) {
		const f = firstIter.next()
		const s = secondIter.next()

		if (f.done || s.done) {
			return
		}

		yield [ f.value, s.value ]
	}
}
