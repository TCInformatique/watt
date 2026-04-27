<script lang="ts">
	import '../app.css'
	import favicon from '$lib/assets/favicon.svg'
	import { Toaster } from 'svelte-sonner'
	import DrawerOrg from './DrawerOrg.svelte'

	let { children, data } = $props()
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<DrawerOrg {data} />
<Toaster />

{@render children?.()}
