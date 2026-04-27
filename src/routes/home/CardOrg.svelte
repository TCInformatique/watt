<script lang="ts">
	import { PencilIcon } from '@lucide/svelte'
	import type { PageData } from './$types'
	import { tip, urlParam } from 'fuma'
	import { fromStore } from 'svelte/store'

	let { org }: { org: PageData['members'][number]['org'] } = $props()
</script>

<div class="card card-border shadow-md bg-base-100 relative hover:shadow-lg transition-shadow">
	<a href="/logs?orgId={org.id}" class="inset-0 absolute">{' '}</a>
	<div class="card-body">
		<div class="flex item-center gap-1">
			<h3 class="card-title">{org.name}</h3>

			<a
				href={fromStore(urlParam).current.with({ form_org: org.id })}
				class="z-10 btn btn-square btn-xs ml-auto"
				use:tip={{ content: 'Modifier' }}
			>
				<PencilIcon class="h-4" />
			</a>
		</div>

		<div class="grid grid-cols-3 gap-4 text-center mt-4">
			<a
				href="/members?orgId={org.id}"
				class="z-10 border border-base-300 p-4 rounded-lg hover:outline-1"
			>
				<div class="text-xl font-semibold text-green-800">{org._count.members}</div>
				<div class="font-light">Membres</div>
			</a>
		</div>
	</div>
</div>
