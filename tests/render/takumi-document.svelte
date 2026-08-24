<script lang="ts">
	import PdfcnThemeProvider from '$lib/PdfcnThemeProvider.svelte';
	import Graph from '$lib/bases/takumi/components/graph/graph.svelte';
	import PageNumber from '$lib/bases/takumi/components/page-number/page-number.svelte';
	import Text from '$lib/bases/takumi/components/text/text.svelte';
	import Document from '$lib/bases/takumi/lib/Document.svelte';
	import Page from '$lib/bases/takumi/lib/Page.svelte';
	import { modernTheme } from '$lib/themes/modern';

	const data = [
		{ label: 'Alpha', value: 12 },
		{ label: 'Beta', value: 20 },
		{ label: 'Gamma', value: 16 }
	];
</script>

<PdfcnThemeProvider theme={modernTheme}>
	<Document title="pdfcn-svelte Takumi smoke test">
		<Page size="A4" style={{ backgroundColor: modernTheme.colors.background, padding: 40 }}>
			<Text variant="xl" weight="bold" color="primary">Takumi renderer smoke test</Text>
			<Graph
				variant="bar"
				{data}
				title="Quarterly activity"
				width={240}
				height={120}
				legend="none"
				showValues
			/>
			<PageNumber format={'Smoke page {page}'} />
		</Page>
		<Page size={{ width: 300, height: 400 }}>
			<Text noMargin>Second page content</Text>
			<PageNumber format={'Smoke page {page}'} muted={false} />
		</Page>
	</Document>
</PdfcnThemeProvider>
