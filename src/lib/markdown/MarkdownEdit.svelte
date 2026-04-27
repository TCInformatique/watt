<script lang="ts" module>
	import { Carta, MarkdownEditor } from 'carta-md'
	import DOMPurify from 'isomorphic-dompurify'
	import { attachment } from '@cartamd/plugin-attachment'
	import './carta.css'

	const carta = new Carta({
		sanitizer: DOMPurify.sanitize,
		extensions: [
			attachment({
				upload(file) {
					console.log('TODO: upload', file)
					return Promise.resolve('ok')
				}
			})
		]
	})
</script>

<script lang="ts">
	let { value = $bindable(), placeholder }: { value: string; placeholder?: string } = $props()
</script>

<MarkdownEditor
	{carta}
	bind:value
	mode="tabs"
	{placeholder}
	userLabels={{ writeTab: 'Rédaction', previewTab: 'Aperçu' }}
/>
