<script lang="ts">
	import Logs from '$lib/logs/Logs.svelte'
	import { heightScreen, Placeholder } from 'fuma'
	import { ClipboardListIcon, FolderOpenIcon, IdCardIcon } from '@lucide/svelte'
	import { memberActions } from '../snippets.svelte'
	import Section from './Section.svelte'
	import SectionProfile from './SectionProfile.svelte'
	import SectionMonitoring from './SectionMonitoring.svelte'

	let { data } = $props()
</script>

<div class="grid grid-cols-2 gap-4 overflow-hidden items-stretch">
	<div class="flex flex-col gap-4" use:heightScreen>
		<Section
			title="{data.member.contact.firstName} {data.member.contact.lastName}"
			Icon={IdCardIcon}
			class="shrink-0"
		>
			{#snippet actions()}
				{@render memberActions(data.member)}
			{/snippet}
			<SectionProfile contact={data.member.contact} />
		</Section>
		<Section title="Inscriptions" Icon={ClipboardListIcon}>
			<SectionMonitoring />
		</Section>

		<Section title="Documents" Icon={FolderOpenIcon} class="shrink-0">
			<Placeholder class="border border-dashed">
				<span>Attestations, evaluations, protocoles...</span>
			</Placeholder>
		</Section>
	</div>
	<Logs
		logs={data.contactLogs}
		title="le journal de {data.member.contact.firstName}"
		class="w-full"
	/>
</div>
