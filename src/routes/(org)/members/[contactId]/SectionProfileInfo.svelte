<script lang="ts">
	import type { Component, Snippet } from 'svelte'
	import { type IconProps } from '@lucide/svelte'

	let { Icon, href, children }: { Icon: Component<IconProps>; href?: string; children: Snippet } =
		$props()
</script>

{#if href}
	<a {href} class="flex items-center gap-2 link link-hover" target="_blank">
		<Icon class="h-3.5 opacity-70 shrink-0" />
		{@render children()}
	</a>
{:else}
	<div class="flex items-center gap-2">
		<Icon class="h-3.5 opacity-70 shrink-0" />
		{@render children()}
	</div>
{/if}
