<script lang="ts" module>
	import type { LogWithAll } from '.'

	export { snippetDate, snippetMember }
</script>

{#snippet snippetDate(date: Date | null | string)}
	{#if date}
		<span>{new Date(date).toLocaleDateString()}</span>
	{:else}
		<span>-</span>
	{/if}
{/snippet}

{#snippet snippetMember(member: LogWithAll['member'])}
	{#if member}
		<b>{member.contact.firstName} {member.contact.lastName}</b>
	{:else}
		<span class="badge badge-sm badge-warning badge-soft">membre supprimé</span>
	{/if}
{/snippet}
