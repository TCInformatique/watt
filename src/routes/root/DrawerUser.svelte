<script lang="ts">
	import { Drawer, Form, InputSelect } from 'fuma'
	import type { LayoutData } from './$types'
	import { useDrawerFormOptions } from '$lib/formOptions'

	let { data }: { data: LayoutData } = $props()
	let formData = $derived(data.formDataUser)
</script>

<Drawer
	key="form_user"
	class="border-l shadow-xl"
	let:close
	title={formData?.id ? 'Update user' : `Create user`}
>
	<div class="flex flex-col gap-2 pt-6">
		<h2 class="text-xl">{formData?.contact?.firstName} {formData?.contact?.lastName}</h2>
		<h3>{formData?.email}</h3>
	</div>

	<Form data={formData} action="/root/users?/user" options={useDrawerFormOptions(close)}>
		<div class="grid py-4 gap-4">
			<InputSelect key="role" options={['admin', 'basic']} value={formData?.role} />
		</div>
	</Form>
</Drawer>
