<script module lang="ts">
	import { Icon, type TableField } from 'fuma'
	import { optionsContactGender, optionsMemberRole } from '$lib/selectOptions'
	import type { MemberWithContact } from '$lib/types'
	import dayjs from 'dayjs'

	export const fieldsMember: TableField<MemberWithContact>[] = [
		{
			key: 'firstName',
			label: 'Prénom',
			cell: () => cellFirstName,
			locked: true,
			type: 'string'
		},
		{
			key: 'lastName',
			label: 'Nom',
			cell: () => cellLastName,
			locked: true,
			type: 'string'
		},
		{
			key: 'role',
			label: 'Rôle',
			cell: () => cellRole,
			visible: true,
			type: 'select',
			options: optionsMemberRole
		},
		{
			key: 'email',
			label: 'Email',
			cell: () => cellEmail,
			visible: true,
			type: 'string'
		},
		{
			key: 'phone',
			label: 'Téléphone',
			cell: () => cellPhone,
			visible: true,
			type: 'string'
		},
		{
			key: 'birthday',
			label: 'Naissance',
			cell: () => cellBirthday,
			type: 'date'
		},
		{
			key: 'gender',
			label: 'Genre',
			type: 'select',
			cell: () => cellGender,
			options: optionsContactGender
		},
		{
			key: 'zipCode',
			label: 'NPA',
			cell: (item) => item.contact.zipCode
		},
		{
			key: 'city',
			label: 'Localité',
			cell: (item) => item.contact.city
		},
		{
			key: 'street',
			label: 'Rue',
			cell: (item) => item.contact.street
		},
		{
			key: 'isInvitation',
			label: 'Invitation',
			cell: (item) => item.contact.isInvitation
		}
	]
</script>

{#snippet cellFirstName({ contact, orgId }: MemberWithContact)}
	<a href="/members/{contact.id}" class="link link-hover">
		{contact.firstName}
	</a>
{/snippet}

{#snippet cellLastName({ contact, orgId }: MemberWithContact)}
	<a href="/members/{contact.id}" class="link link-hover">
		{contact.lastName}
	</a>
{/snippet}

{#snippet cellEmail({ contact }: MemberWithContact)}
	{#if contact.email}
		<a href="mailto:{contact.email}" class="link link-hover">{contact.email}</a>
	{:else}
		<span>-</span>
	{/if}
{/snippet}

{#snippet cellPhone({ contact }: MemberWithContact)}
	{#if contact.phone}
		<a href="tel:{contact.phone}" class="link link-hover">{contact.phone}</a>
	{:else}
		<span>-</span>
	{/if}
{/snippet}

{#snippet cellBirthday({ contact }: MemberWithContact)}
	{#if contact.birthday}
		<div class="flex items-center gap-2">
			<span>{contact.birthday.toLocaleDateString()}</span>
			<span class="badge whitespace-nowrap">{dayjs().diff(contact.birthday, 'year')} ans</span>
		</div>
	{:else}
		<span>-</span>
	{/if}
{/snippet}

{#snippet cellGender({ contact }: MemberWithContact)}
	{#if contact.gender}
		<Icon
			title={optionsContactGender[contact.gender].label}
			tippyProps={{ placement: 'right' }}
			path={optionsContactGender[contact.gender].icon}
			class="w-5 opacity-70"
		/>
	{:else}
		<span>-</span>
	{/if}
{/snippet}

{#snippet cellRole({ role }: MemberWithContact)}
	<div class="flex gap-2">
		<Icon
			tippyProps={{ placement: 'right' }}
			path={optionsMemberRole[role].icon}
			class="w-5 opacity-70"
		/>
		<span>{optionsMemberRole[role].label}</span>
	</div>
{/snippet}
