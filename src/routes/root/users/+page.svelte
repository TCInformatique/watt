<script lang="ts">
	import type { UserBasic } from '$lib/types.js'
	import { PencilIcon, UsersIcon } from '@lucide/svelte'
	import { Table, tip, urlParam } from 'fuma'

	let { data } = $props()
</script>

<div class="flex mb-4 gap-4 items-center">
	<UsersIcon />
	<h2 class="text-xl">Users</h2>
</div>

<Table
	items={data.users}
	fields={[
		{
			key: 'name',
			label: 'Name',
			cell: (item) => `${item.contact.firstName} ${item.contact.lastName}`,
			visible: true
		},
		{
			key: 'email',
			label: 'Email',
			cell: (item) => item.email,
			visible: true
		},
		{
			key: 'role',
			label: 'Role',
			cell: (item) => item.role,
			visible: true
		},
		{
			key: 'createdAt',
			label: 'Name',
			cell: (item) => item.createdAt,
			visible: true
		}
	]}
	actions={actionsUser}
	class="border-input"
/>

{#snippet actionsUser(user: UserBasic)}
	<div class="flex gap-1">
		<a
			href={$urlParam.with({ form_user: user.id })}
			class="btn btn-xs btn-square"
			use:tip={{ content: 'Update' }}
		>
			<PencilIcon class="h-4" />
		</a>
	</div>
{/snippet}
