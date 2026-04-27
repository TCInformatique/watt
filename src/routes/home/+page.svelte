<script lang="ts">
	import UserMenu from '../MenuUser.svelte'
	import { InboxIcon, SchoolIcon } from '@lucide/svelte'
	import { urlParam } from 'fuma'

	import CardOrg from './CardOrg.svelte'
	import CardInvitation from './CardInvitation.svelte'

	let { data } = $props()
</script>

<div class="min-h-screen">
	<div class="max-w-2xl p-4 mx-auto">
		<div class="flex mb-4 my-14 gap-4 items-center">
			<SchoolIcon />
			<h2 class="text-xl">Mes organisations</h2>

			{#if data.user.role !== 'basic'}
				<a
					href={$urlParam.with({ form_org: '{}' })}
					class="btn ml-auto"
					class:btn-primary={!data.members.length}
				>
					Créer une organisation
				</a>
			{/if}
		</div>
		<div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));">
			{#each data.members as member}
				<CardOrg org={member.org} />
			{:else}
				{#if !data.invitations.length}
					<div
						class="rounded-box p-2 bg-base-200/40 text-base-content/60 border border-dashed flex flex-col items-center gap-4 py-12"
					>
						<InboxIcon class="h-16 w-16" />
						<div>
							<h3 class="text-xl font-semibold mb-2 text-center">Aucune organisation</h3>
							{#if data.user.role === 'basic'}
								<p>
									Vous n'êtes membre d'aucune organisation pour l'instant. Attendez une invitation
									pour rejoindre une organisation.
								</p>
								<div class="mt-4 flex justify-center">
									<a
										href="mailto:jonas.voisard@gmail.com?subject=Demande de création"
										class="btn text-center btn-secondary"
									>
										Je souhaite créer ma propre organisation
									</a>
								</div>
							{:else}
								<p>
									Vous n'êtes membre d'aucune organisation pour l'instant.
									<a href={$urlParam.with({ form_org: '{}' })} class="link link-hover">
										Créez une organisation
									</a>
									ou attendez une invitation.
								</p>
							{/if}
						</div>
					</div>
				{/if}
			{/each}
		</div>

		{#if data.invitations.length}
			<div class="divider"></div>
			<div class="flex mb-4 gap-4 items-center">
				<InboxIcon />
				<h2 class="text-xl">Invitations</h2>
			</div>
			<div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));">
				{#each data.invitations as invitation}
					<CardInvitation {invitation} />
				{/each}
			</div>
		{/if}
	</div>

	<div class="fixed left-2 bottom-2">
		<UserMenu user={data.user} />
	</div>
</div>
