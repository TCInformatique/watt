<script lang="ts">
	import {
		ChevronsUpDownIcon,
		PencilIcon,
		SchoolIcon,
		PlusIcon,
		CheckIcon,
		XIcon
	} from '@lucide/svelte'
	import { DropDown, Icon, tip, urlParam, useForm } from 'fuma'
	import { fromStore } from 'svelte/store'
	import type { LayoutData } from './$types'
	import { optionsMemberRole } from '$lib/selectOptions'
	import { toast } from 'svelte-sonner'

	let { data }: { data: LayoutData } = $props()

	let { org, userMembers, invitations } = $derived(data)

	let minWidth = $state(0)

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

<DropDown class="border-input" hideOnBlur tippyProps={{ placement: 'right-start' }}>
	<button slot="activator" class="btn btn-ghost w-full relative" bind:clientWidth={minWidth}>
		<SchoolIcon class="h-5" />
		<span>{org.name}</span>
		<ChevronsUpDownIcon class="ml-auto w-3.5 translate-x-2 opacity-60" />
		{#if invitations.length}
			<div class="absolute w-3 h-3 bg-primary -right-1 -top-1 rounded-full animate-ping"></div>
			<div
				class="absolute w-3 h-3 bg-primary -right-1 -top-1 rounded-full"
				use:tip={{
					content: `${invitations.length} invitation${invitations.length > 1 ? 's' : ''}`
				}}
			></div>
		{/if}
	</button>

	<ul style="min-width: {minWidth - 8}px;">
		{#if invitations.length}
			<li class="menu-title text-xs">Invitations</li>
			{#each invitations as invitation}
				<div class="flex gap-3 items-center p-2 border border-primary bg-primary/5 rounded my-2">
					<div class="flex flex-col gap-1">
						{#each invitation.members as member}
							<div class="flex gap-2">
								<Icon path={optionsMemberRole[member.role].icon} />
								<span>{optionsMemberRole[member.role].label} </span>
								<span>@{member.org.name}</span>
							</div>
						{/each}
					</div>
					<form class="flex gap-1" method="post" use:enhance>
						<input type="hidden" name="id" value={invitation.id} />
						<button
							class="btn btn-sm btn-error btn-outline btn-square"
							formaction="/?/invitation_declined"
							use:tip={{ content: 'Décliner' }}
						>
							<XIcon />
						</button>
						<button
							class="btn btn-sm btn-success btn-square"
							formaction="/?/invitation_accept"
							use:tip={{ content: 'Rejoindre' }}
						>
							<CheckIcon />
						</button>
					</form>
				</div>
			{/each}
		{/if}

		<li class="menu-title text-xs">Organisations</li>

		{#each userMembers as member}
			<div class="flex gap-1">
				<li class="grow">
					<a
						href={fromStore(urlParam).current.with({ orgId: member.org.id })}
						class="grow {org.id === member.orgId ? 'menu-active' : ''}"
						data-sveltekit-preload-data="off"
					>
						{member.org.name}
					</a>
				</li>
				{#if member.role === 'admin'}
					<a
						href={fromStore(urlParam).current.with({ form_org: member.org.id })}
						class="btn btn-sm btn-square"
						use:tip={{ content: 'Modifier', placement: 'right' }}
					>
						<PencilIcon class="h-4" />
					</a>
				{/if}
			</div>
		{/each}

		<div class="border-input border-t mx-3 my-1"></div>

		<li>
			<a href={fromStore(urlParam).current.with({ form_org: '{}' })}>
				<PlusIcon size="16" class="h-8" />
				Ajouter une organisation
			</a>
		</li>
	</ul>
</DropDown>
