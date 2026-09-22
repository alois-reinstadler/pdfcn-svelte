<script lang="ts">
	import { PdfcnThemeProvider } from 'pdfcn-svelte';
	import { professionalTheme } from 'pdfcn-svelte/themes';
	import { Document, Page, Text } from 'pdfcn-svelte/bases/forme';
	// Built-in Helvetica avoids a network font dependency in this example.
	const theme = {
		...professionalTheme,
		typography: {
			...professionalTheme.typography,
			body: { ...professionalTheme.typography.body, fontFamily: 'Helvetica' },
			heading: {
				...professionalTheme.typography.heading,
				fontFamily: 'Helvetica'
			}
		}
	};
	let { customer = 'Ada Lovelace' }: { customer?: string } = $props();
</script>

<PdfcnThemeProvider {theme}>
	<Document title="Text example">
		<Page size="A4" margin={48}>
			<Text variant="lg" weight="semibold">Payment received</Text><Text
				color="mutedForeground"
				italic>Prepared for {customer}.</Text
			>
		</Page>
	</Document>
</PdfcnThemeProvider>
