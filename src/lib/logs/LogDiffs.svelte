<script lang="ts" generics="T extends {}, Data extends LogUpdate<T>">
	import type { LogUpdate } from '$lib/server/logs/logger'
	import type { Snippet } from 'svelte'
	import LogDiff from './LogDiff.svelte'

	let {
		data,
		labels,
		snippets = {}
	}: {
		data: Data
		labels: Record<keyof T, string>
		snippets?: Partial<{ [K in keyof Data['before']]: Snippet<[Data['before'][K]]> }>
	} = $props()

	let diffKeys = $derived.by(() => {
		const diffKeys: (keyof T)[] = []
		const keys = new Set([...Object.keys(data.before), ...Object.keys(data.after)] as (keyof T)[])
		for (const key of keys) {
			if (key === 'updatedAt') continue
			if (isDifferent(data.before[key], data.after[key])) {
				diffKeys.push(key)
			}
		}
		return diffKeys
	})

	function isDifferent(a: unknown, b: unknown): boolean {
		if (typeof a === 'object' && typeof b === 'object') {
			return JSON.stringify(a) !== JSON.stringify(b)
		}
		if (!a && !b) {
			return false
		}
		return a !== b
	}
</script>

{#each diffKeys as key}
	<LogDiff {data} {key} label={labels[key]} {snippets} />
{/each}
