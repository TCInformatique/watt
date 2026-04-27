<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation'
	import Sidebar from './Sidebar.svelte'
	import DrawerMember from './DrawerMember.svelte'

	let { children, data } = $props()

	afterNavigate(async (navigation) => {
		const url = navigation.to?.url
		if (url?.searchParams.has('invalidateAll')) {
			url.searchParams.delete('invalidateAll')
			await goto(url, { replaceState: true, invalidateAll: true })
		}
	})
</script>

<svelte:head>
	<title>Classe: {data.org.name}</title>
</svelte:head>

<div class="h-screen flex">
	<Sidebar {data} />
	<main class="grow bg-base-200 h-screen overflow-hidden">
		<div class="p-4">
			{@render children?.()}
		</div>
	</main>
	<DrawerMember {data} />
</div>
