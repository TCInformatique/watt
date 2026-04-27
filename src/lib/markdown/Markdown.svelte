<script lang="ts" module>
	import { Carta, Markdown } from 'carta-md'
	import DOMPurify from 'isomorphic-dompurify'
	import './carta.css'

	const carta = new Carta({
		sanitizer: DOMPurify.sanitize,
		extensions: []
	})
</script>

<script lang="ts">
	let { value }: { value: string } = $props()
</script>

<Markdown {carta} {value} />
