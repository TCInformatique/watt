<script lang="ts" module>
	import { tip, urlParam } from 'fuma'
	import type { MemberWithContact } from '$lib/types'
	import { fromStore } from 'svelte/store'
	import { ClipboardPenLine, PencilIcon } from '@lucide/svelte'

	export { memberActions }
</script>

{#snippet memberActions(member: MemberWithContact)}
	<div class="flex gap-1 justify-end">
		<a
			href={fromStore(urlParam).current.with({ form_subscribe: JSON.stringify({ member }) })}
			class="btn btn-xs btn-square"
			use:tip={{ content: 'Nouvelle inscription' }}
		>
			<ClipboardPenLine class="h-4" />
		</a>
		<a
			href={fromStore(urlParam).current.with({ form_member: member.id })}
			class="btn btn-xs btn-square"
			use:tip={{ content: 'Modifier' }}
		>
			<PencilIcon class="h-4" />
		</a>
	</div>
{/snippet}
