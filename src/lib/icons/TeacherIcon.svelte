<script module lang="ts">
	import type { SVGAttributes } from 'svelte/elements'

	export { teacherIcon }
</script>

<script>
	let props: SVGAttributes<SVGElement> = $props()
</script>

{#snippet teacherIcon(props: SVGAttributes<SVGElement> = {})}
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}
		><!-- Icon from Tabler Icons by Paweł Kuna - https://github.com/tabler/tabler-icons/blob/master/LICENSE --><g
			fill="none"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			><path d="M8 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v11a1 1 0 0 1-1 1" /><path
				d="M12 14a2 2 0 1 0 4.001-.001A2 2 0 0 0 12 14m5 5a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2"
			/></g
		></svg
	>
{/snippet}

{@render teacherIcon(props)}
