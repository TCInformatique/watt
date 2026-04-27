export function pickProps<Obj extends Record<string, unknown>, Keys extends (keyof Obj)[]>(
	obj: Obj,
	...keys: Keys
): { [K in Keys[number]]: Obj[K] } {
	const picked: Partial<{ [K in Keys[number]]: Obj[K] }> = {}
	for (const key of keys) {
		picked[key] = obj[key]
	}
	return picked as { [K in Keys[number]]: Obj[K] }
}
