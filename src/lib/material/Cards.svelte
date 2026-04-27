<script lang="ts" generics="Item">
	import type { Snippet } from 'svelte'

	let {
		minWidth = 400,
		items,
		card
	}: { minWidth?: number; items: Item[]; card: Snippet<[Item]> } = $props()
</script>

<div
	class="grid gap-4"
	style="grid-template-columns: repeat(auto-fill, minmax({minWidth}px, 1fr));"
>
	{#each items as item}
		{@render card(item)}
	{/each}
</div>
