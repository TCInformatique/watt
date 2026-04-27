<script lang="ts" generics="T extends {}, Data extends LogUpdate<T>">
	import type { LogUpdate } from '$lib/server/logs/logger'
	import { ArrowRightIcon } from '@lucide/svelte'
	import type { Snippet } from 'svelte'

	let {
		data,
		key,
		label,
		snippets = {}
	}: {
		data: Data
		key: keyof Data['before']
		label?: string
		snippets?: Partial<{ [K in keyof Data['before']]: Snippet<[Data['before'][K]]> }>
	} = $props()

	const snip = $derived(snippets[key])
</script>

<div class="flex items-center gap-1 mt-1">
	{#if label}
		<span class="badge badge-soft badge-sm mr-2">{label}</span>
	{/if}
	<div class="opacity-60">
		{#if snip}
			{@render snip(data.before[key])}
		{:else if typeof data.before[key] === 'object'}
			<span class="badge badge-error badge-outline badge-sm">Rendering error</span>
		{:else}
			<span>{data.before[key]}</span>
		{/if}
	</div>
	<ArrowRightIcon class="h-3 opacity-60" />
	{#if snip}
		{@render snip(data.after[key])}
	{:else if typeof data.after[key] === 'object'}
		<span class="badge badge-error badge-outline badge-sm">Rendering error</span>
	{:else}
		<span>{data.after[key]}</span>
	{/if}
</div>
