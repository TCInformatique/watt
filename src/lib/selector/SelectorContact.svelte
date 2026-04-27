<script lang="ts">
	import { DropDown, InputRelation, urlParam } from 'fuma'
	import { onMount, type Component } from 'svelte'
	import { BookUserIcon, CakeIcon, MailIcon, PhoneIcon, type IconProps } from '@lucide/svelte'
	import type { Contact } from '@prisma/client'
	import { apiClient } from '$lib/api'
	import Fuse, { type FuseResult } from 'fuse.js'
	import Highlight from './Highlight.svelte'
	import { multiTokenFuseSearch } from './multiTokenFuse'

	let {
		addCreateButton = false,
		value,
		disabled = false,
		label,
		focusShortcutEnable = false,
		onSelect = () => {},
		placeholder = 'Recherche dans le répertoire'
	}: {
		addCreateButton?: boolean
		value?: Contact
		disabled?: boolean
		label?: string
		focusShortcutEnable?: boolean
		onSelect?: (contact: Contact | null, dropdown?: DropDown) => void
		placeholder?: string
	} = $props()

	type ContactWithFuseResult = Contact & Omit<FuseResult<Contact>, 'item' | 'refIndex'>

	let inputRelation = $state<InputRelation<ContactWithFuseResult>>()
	let dropdown = $state<DropDown>()

	onMount(() => {
		if (!focusShortcutEnable) return
		async function handleShortcut(event: KeyboardEvent) {
			const { metaKey, ctrlKey, key } = event
			if ((metaKey || ctrlKey) && key === 'k') {
				event.preventDefault()
				inputRelation?.clear()
				return
			}
		}
		window.addEventListener('keydown', handleShortcut)
		return () => {
			window.removeEventListener('keydown', handleShortcut)
		}
	})

	let fuse = new Fuse<Contact>([], {
		keys: ['firstName', 'lastName', 'email', 'phone', 'birthdayAsString'],
		includeMatches: true,
		ignoreLocation: true,
		ignoreDiacritics: true
	})

	async function search(value: string): Promise<ContactWithFuseResult[]> {
		const contacts = await apiClient.contact({ search: value })
		if (!value) return contacts
		fuse.setCollection(contacts)
		const searchTokens = value.split(' ').slice(0, 4)
		return multiTokenFuseSearch(fuse, searchTokens).map(({ item, ...result }) => ({
			...item,
			...result
		}))
	}
</script>

<InputRelation
	bind:this={inputRelation}
	bind:dropdown
	Icon={BookUserIcon}
	key="contactId"
	{label}
	on:input={(e) => onSelect(e.detail.value, dropdown)}
	{search}
	{placeholder}
	slotItem={snippetItem}
	slotSuggestion={snippetSuggestion}
	bind:value
	{disabled}
	createUrl={addCreateButton ? $urlParam.with({ form_member: '{}' }) : ''}
	dropdownProps={{
		classWrapper: 'z-50 w-full max-w-80 max-h-none',
		tippyProps: { animation: false }
	}}
	shortcutKey={focusShortcutEnable ? '⌘ K' : undefined}
	debounceMs={0}
/>

{#snippet snippetItem(contact: ContactWithFuseResult)}
	<div class="flex items-center gap-2">
		<BookUserIcon class="h-5 w-5 shrink-0 opacity-70" />
		<span>{contact.firstName} {contact.lastName}</span>
	</div>
{/snippet}

{#snippet snippetSuggestion(contact: ContactWithFuseResult)}
	<div class="w-72">
		<h4 class="font-semibold z-50 my-1">
			<Highlight key="firstName" value={contact.firstName} matches={contact.matches} />
			<Highlight key="lastName" value={contact.lastName} matches={contact.matches} />
		</h4>
		<div class="flex flex-wrap gap-x-2 gap-y-0 text-xs">
			{@render contactInfo('email', contact.email, MailIcon)}
			{@render contactInfo('phone', contact.phone, PhoneIcon)}
			{@render contactInfo('birthdayAsString', contact.birthdayAsString, CakeIcon)}
		</div>
	</div>

	{#snippet contactInfo(key: keyof Contact, value: string | null, Icon: Component<IconProps>)}
		{#if value}
			<div class="flex items-center gap-1">
				<Icon class="w-3 opacity-70" />
				<div class="whitespace-nowrap">
					<Highlight {key} {value} matches={contact.matches} />
				</div>
			</div>
		{/if}
	{/snippet}
{/snippet}
