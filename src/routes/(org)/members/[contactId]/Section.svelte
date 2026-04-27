<script lang="ts">
	import type { IconProps } from '@lucide/svelte'
	import type { Component, Snippet } from 'svelte'

	let {
		title,
		Icon,
		children,
		actions,
		class: klass = ''
	}: {
		title: string
		Icon: Component<IconProps>
		children?: Snippet
		actions?: Snippet
		class?: string
	} = $props()
</script>

<section
	class="{klass}
		rounded-lg border border-input bg-base-100
		grow min-h-0 overflow-y-auto
	"
>
	<h4 class="flex gap-2 items-center sticky top-0 pl-3 p-2 bg-base-100/70 backdrop-blur-sm z-10">
		<Icon class="h-5 opacity-70" />
		<span class="tracking-wider font-semibold opacity-70">
			{title}
		</span>
		<div class="grow"></div>
		{@render actions?.()}
	</h4>
	<div class="px-3 pb-3">
		{@render children?.()}
	</div>
</section>
