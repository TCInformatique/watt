<script lang="ts">
	import type { LayoutData } from './$types'
	import { Drawer, Form, InputText } from 'fuma'
	import { useDrawerFormOptions } from '$lib/formOptions'

	let { data }: { data: LayoutData } = $props()

	let formData = $derived(data.formDataOrg)
</script>

<Drawer
	key="form_org"
	class="border-l shadow-xl"
	let:close
	title={formData?.id ? 'Modifier une organisation' : 'Nouvelle organisation'}
>
	<Form data={formData} action="/?/org" options={useDrawerFormOptions(close)}>
		<div class="py-4">
			<InputText
				label="Nom"
				key="name"
				input={{ autocomplete: 'off', autofocus: true }}
				value={formData?.name}
			/>
		</div>
	</Form>
</Drawer>
