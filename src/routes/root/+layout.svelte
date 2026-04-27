<script lang="ts">
	import DrawerUser from './DrawerUser.svelte'
	import RootSidebar from './RootSidebar.svelte'

	let { data, children } = $props()
</script>

<div class="min-h-screen flex">
	<RootSidebar user={data.user} />
	<main class="p-4 grow bg-base-200">
		{@render children?.()}
	</main>
	<DrawerUser {data} />
</div>
