<script lang="ts">
	import { optionsMemberRole } from '$lib/selectOptions'
	import { Icon, useForm } from 'fuma'
	import type { PageData } from './$types'
	import { toast } from 'svelte-sonner'

	let { invitation }: { invitation: PageData['invitations'][number] } = $props()

	const { enhance } = useForm({
		onSuccess(action) {
			if (action.searchParams.has('/invitation_declined')) {
				toast.success('Invitation déclinée')
			} else {
				toast.success('Invitation acceptée')
			}
		}
	})
</script>

<div class="card card-border shadow-md bg-base-100">
	<div class="card-body">
		<div class="flex item-center gap-1">
			<h2 class="card-title">
				{invitation.members.length} organisation{invitation.members.length > 1 ? 's' : ''}
			</h2>
		</div>

		<div class="flex gap-4 flex-wrap my-2">
			{#each invitation.members as member}
				<div class="flex gap-2 border px-4 py-2 rounded border-base-300">
					<Icon path={optionsMemberRole[member.role].icon} />
					<span>{optionsMemberRole[member.role].label} </span>
					<span>-</span>
					<span>{member.org.name}</span>
				</div>
			{/each}
		</div>
		<form class="justify-end card-actions" method="post" use:enhance>
			<input type="hidden" name="id" value={invitation.id} />
			<button class="btn btn-error btn-outline" formaction="/?/invitation_declined">
				Décliner
			</button>
			<button class="btn btn-primary" formaction="/?/invitation_accept"> Rejoindre </button>
		</form>
	</div>
</div>
