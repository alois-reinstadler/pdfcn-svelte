<script lang="ts">
	import { Document, Page, Graph, type GraphVariant } from '$lib/bases/takumi';

	let { variant = 'bar' }: { variant?: GraphVariant } = $props();
	const data = [
		{ label: 'Alpha', value: 37 },
		{ label: 'Beta', value: 83 }
	];
</script>

<Document title="Graph text layers">
	<Page flow size="A4" margin={48}>
		<Graph {variant} {data} width={440} height={240} showValues legend="none" />
	</Page>
</Document>
