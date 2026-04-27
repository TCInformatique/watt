<script lang="ts">
	import { CakeIcon, MailIcon, PhoneIcon, type IconProps } from '@lucide/svelte'
	import type { Component } from 'svelte'
	import { maxHeightScreen } from 'fuma'
	import dayjs from 'dayjs'
	import type { MemberWithContact } from '$lib/types'

	let {
		members,
		selectedMember
	}: { members: MemberWithContact[]; selectedMember: MemberWithContact | null } = $props()
</script>

<div class="overflow-y-scroll max-w-84 pl-4 pr-1 pt-0.5 -translate-x-4 pb-40" use:maxHeightScreen>
	<div class="flex flex-col gap-4">
		{#each members.slice(0, 6) as member}
			{@const isSelected = selectedMember?.id === member.id}
			{@const birthday = member.contact.birthday
				? dayjs(member.contact.birthday).format('MM.DD.YYYY')
				: null}
			<div
				class="
					card card-sm bg-base-100
					shadow border border-base-100 hover:shadow-lg ring-primary
				"
				class:ring={isSelected}
				class:shadow-lg={isSelected}
			>
				<div class="card-body">
					<h4 class="card-title">
						{member.contact.firstName}
						{member.contact.lastName}
					</h4>
					<div class="flex flex-wrap gap-x-2 text-xs">
						{@render contactInfo(member.contact.email, MailIcon)}
						{@render contactInfo(member.contact.phone, PhoneIcon)}
						{@render contactInfo(birthday, CakeIcon)}

						<!-- TODO: relations -->
						<!-- <div class="flex items-center whitespace-nowrap" title="Assisté par {employe.name}">
							<SquareUserRound class="h-3 opacity-70" />
	
							<Highlight key="employe.name" value={employe.name} {matches} />
	
							{#if employe.phone}
								<span class="ml-1 badge badge-ghost badge-xs">
									<Phone class="w-2 translate-x-0.5 opacity-70" />
									{employe.phone}
								</span>
							{/if}
						</div> -->
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

{#snippet contactInfo(info: string | null, Icon: Component<IconProps>)}
	{#if info}
		<div class="flex items-center gap-1">
			<Icon class="w-3 opacity-70" />
			<span class="font-mono whitespace-nowrap">
				{info}
			</span>
		</div>
	{/if}
{/snippet}
