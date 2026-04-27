<script lang="ts">
	import { UsersIcon } from '@lucide/svelte'
	import { Table } from 'fuma'
	import type { PageData } from './$types.js'

	let { data } = $props()
</script>

<div class="flex mb-4 gap-4 items-center">
	<UsersIcon />
	<h2 class="text-xl">Users</h2>
</div>

<Table
	items={data.orgs}
	fields={[
		{
			key: 'name',
			label: 'Name',
			cell: (item) => item.name,
			visible: true
		},
		{
			key: 'admins',
			label: 'Admins',
			cell: () => cellAdmins,
			visible: true
		},
		{
			key: 'createdAt',
			label: 'Created at',
			cell: (item) => item.createdAt,
			visible: true
		}
	]}
	class="border-input"
/>

{#snippet cellAdmins(org: PageData['orgs'][number])}
	{#each org.members as member}
		<span class="badge">{member.contact.firstName} {member.contact.lastName}</span>
	{/each}
{/snippet}
