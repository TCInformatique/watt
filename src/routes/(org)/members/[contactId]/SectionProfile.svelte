<script lang="ts">
	import type { Component } from 'svelte'
	import {
		CakeIcon,
		MailIcon,
		MapPinnedIcon,
		PhoneIcon,
		SchoolIcon,
		SquareUserIcon,
		type IconProps
	} from '@lucide/svelte'
	import SectionProfileInfo from './SectionProfileInfo.svelte'
	import type { PageData } from './$types'

	let { contact }: { contact: PageData['member']['contact'] } = $props()
</script>

<div class="grid grid-cols-2 gap-3 text-sm">
	<div class="flex flex-col gap-0.5">
		<SectionProfileInfo Icon={MailIcon} href="mailto:{contact.email}">
			<span>{contact.email}</span>
		</SectionProfileInfo>
		<SectionProfileInfo Icon={PhoneIcon} href="tel:{contact.phone}">
			<span>{contact.phone}</span>
		</SectionProfileInfo>
		<SectionProfileInfo Icon={CakeIcon}>
			<span>{contact.birthdayAsString}</span>
		</SectionProfileInfo>
		<SectionProfileInfo Icon={MapPinnedIcon}>
			<div>
				<span>{contact.street}</span> <br />
				<span>{contact.zipCode} {contact.city}</span>
			</div>
		</SectionProfileInfo>
	</div>
	<div>
		{#each contact.members as { org }}
			<SectionProfileInfo Icon={SchoolIcon}>
				<span>{org.name}</span>
			</SectionProfileInfo>
		{/each}
		<SectionProfileInfo Icon={SquareUserIcon}>
			<span>Assistant·te</span>
		</SectionProfileInfo>
		<SectionProfileInfo Icon={SquareUserIcon}>
			<span>Curateur·trice</span>
		</SectionProfileInfo>
	</div>
</div>

{#snippet contactInfo(value: string | null, Icon: Component<IconProps>)}
	{#if value}
		<div class="flex items-center gap-2">
			<Icon class="h-3.5 opacity-70 shrink-0" />
			<div class="">
				{value}
			</div>
		</div>
	{/if}
{/snippet}

{#snippet contactInfoLink(value: string | null, Icon: Component<IconProps>, href: string)}
	{#if value}
		<a {href} class="flex items-center gap-2 link link-hover" target="_blank">
			<Icon class="h-3.5 opacity-70 shrink-0" />
			<div class="whitespace-nowrap">
				{value}
			</div>
		</a>
	{/if}
{/snippet}
