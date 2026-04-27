<script lang="ts">
	import { Drawer, Form, InputBoolean, InputDate, InputSelect, InputText } from 'fuma'
	import type { LayoutData } from './$types'
	import { useDrawerFormOptions } from '$lib/formOptions'
	import type { Member } from '@prisma/client'
	import { optionsContactGender, optionsMemberRole } from '$lib/selectOptions'
	import { contactLabels } from '$lib/labels'
	import { page } from '$app/state'
	import { goto } from '$app/navigation'

	let { data }: { data: LayoutData } = $props()
	let formData = $derived(data.formDataMember)
</script>

<Drawer
	key="form_member"
	class="border-l shadow-xl"
	let:close
	title={formData?.id ? 'Modifier un membre' : 'Nouveau membre'}
>
	<Form
		data={formData}
		action="/members?/member"
		options={useDrawerFormOptions(close)}
		on:success={(e) => {
			if (page.route.id?.startsWith('/(org)/members')) {
				const member = e.detail.data as Member
				goto(`/members/${member.contactId}`)
			}
		}}
	>
		<div class="grid grid-cols-2 py-4 gap-4">
			<InputSelect
				key="role"
				label="Role"
				options={optionsMemberRole}
				value={formData?.role || 'student'}
			/>

			{#if formData?.contact?.user}
				<span class="text-sm mt-5 text-accent opacity-70">
					Il y a un compte utilisateur derrière ce contact.
				</span>
			{:else}
				<InputBoolean
					key="contact.isInvitation"
					label={contactLabels['isInvitation']}
					value={formData?.contact?.isInvitation}
				/>
			{/if}

			<hr class="col-span-2" />

			<InputText
				label={contactLabels['firstName']}
				key="contact.firstName"
				value={formData?.contact?.firstName}
				input={{ autocomplete: 'off', autofocus: true }}
			/>
			<InputText
				label={contactLabels['lastName']}
				key="contact.lastName"
				value={formData?.contact?.lastName}
				input={{ autocomplete: 'off' }}
			/>

			<InputText
				label={contactLabels['email']}
				key="contact.email"
				value={formData?.contact?.email}
				input={{ autocomplete: 'off', inputmode: 'email' }}
			/>
			<InputText
				label={contactLabels['phone']}
				key="contact.phone"
				value={formData?.contact?.phone}
				input={{ autocomplete: 'off', inputmode: 'tel' }}
			/>

			<InputText
				label={contactLabels['street']}
				key="contact.street"
				value={formData?.contact?.street}
				input={{ autocomplete: 'off' }}
				class="col-span-2"
			/>
			<InputText
				label={contactLabels['zipCode']}
				key="contact.zipCode"
				value={formData?.contact?.zipCode}
				input={{ autocomplete: 'off' }}
			/>
			<InputText
				label={contactLabels['city']}
				key="contact.city"
				value={formData?.contact?.city}
				input={{ autocomplete: 'off' }}
			/>

			<InputDate
				label={contactLabels['birthday']}
				key="contact.birthday"
				value={formData?.contact?.birthday}
				input={{ autocomplete: 'off' }}
				noPreserveTime
			/>

			<InputSelect
				label={contactLabels['gender']}
				key="contact.gender"
				value={formData?.contact?.gender}
				options={optionsContactGender}
			/>
		</div>
	</Form>
</Drawer>
