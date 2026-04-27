import Fuse, { type FuseResultMatch } from 'fuse.js'
import { mergeRanges } from 'perod'

export type CombinedFuseResult<T> = {
	item: T
	score: number
	matches: FuseResultMatch[]
}

export function multiTokenFuseSearch<T extends { id: number }>(
	fuse: Fuse<T>,
	tokens: string[]
): CombinedFuseResult<T>[] {
	const resultsMap = new Map<number, CombinedFuseResult<T>>()

	for (const token of tokens) {
		const results = fuse.search(token)

		for (const { item, score, matches } of results) {
			if (!resultsMap.has(item.id)) {
				resultsMap.set(item.id, { item, score: 0, matches: [] })
			}
			if (!matches) continue
			const entry = resultsMap.get(item.id)!
			entry.score += score || 0
			entry.matches = mergeMatches(entry.matches, matches)
		}
	}
	return [...resultsMap.values()].sort((a, b) => a.score - b.score)
}

function mergeMatches(a: FuseResultMatch[], b?: readonly FuseResultMatch[]): FuseResultMatch[] {
	if (!b || b.length === 0) return a

	const merged = [...a]

	for (const match of b) {
		const existing = merged.find((m) => m.key === match.key)

		if (existing) {
			// TODO: update perod package to handle tuple and export types
			existing.indices = mergeRanges(
				[...existing.indices, ...match.indices].map(([start, end]) => ({ start, end }))
			).map(({ start, end }) => [start, end])
		} else {
			merged.push({ ...match })
		}
	}

	return merged
}
