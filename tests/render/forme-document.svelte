<script lang="ts">
	import PdfcnThemeProvider from '$lib/PdfcnThemeProvider.svelte';
	import Document from '$lib/bases/forme/lib/Document.svelte';
	import Page from '$lib/bases/forme/lib/Page.svelte';
	import View from '$lib/bases/forme/lib/View.svelte';
	import Text from '$lib/bases/forme/components/text/text.svelte';
	import { modernTheme } from '$lib/themes/modern';
</script>

<PdfcnThemeProvider theme={modernTheme}>
	<Document
		title="pdfcn-svelte Forme smoke test"
		author="pdfcn-svelte"
		creator="render smoke test"
	>
		<Page size="A4" margin={36}>
			<View style={{ borderColor: modernTheme.colors.border, borderWidth: 1, padding: 12 }}>
				<Text variant="xl" weight="bold" color="primary">Forme renderer smoke test</Text>
				<Text noMargin>Theme-aware Svelte content reached the Forme document model.</Text>
			</View>
		</Page>
	</Document>
</PdfcnThemeProvider>
