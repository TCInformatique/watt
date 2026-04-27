<script lang="ts">
	import { Placeholder, Table } from 'fuma'
	import { fieldsMember } from './FieldsMember.svelte'
	import { memberActions } from './snippets.svelte'

	let { data } = $props()
</script>

{#if data.members.length}
	<Table items={data.members} fields={fieldsMember} actions={memberActions} class="border-input" />
{:else}
	<Placeholder class="border border-dashed col-span-full">
		Pas de contacts pour l'instant
	</Placeholder>
{/if}
