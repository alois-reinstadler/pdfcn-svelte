<script lang="ts">
	import { PdfcnThemeProvider } from 'pdfcn-svelte';
	import { professionalTheme } from 'pdfcn-svelte/themes';
	import { Document, Page, Text } from 'pdfcn-svelte/bases/takumi';
	// Built-in sans-serif fallback avoids a network font dependency in this example.
	const theme = {
		...professionalTheme,
		typography: {
			...professionalTheme.typography,
			body: { ...professionalTheme.typography.body, fontFamily: 'sans-serif' },
			heading: {
				...professionalTheme.typography.heading,
				fontFamily: 'sans-serif'
			}
		}
	};
	let { project = 'Ada Lovelace' }: { project?: string } = $props();
</script>

<PdfcnThemeProvider {theme}>
	<Document title="Text example">
		<Page flow size="A4" margin={48}>
			<Text variant="lg" weight="semibold">Payment received</Text><Text
				color="mutedForeground"
				italic>Prepared for {project}.</Text
			>
		</Page>
	</Document>
</PdfcnThemeProvider>
