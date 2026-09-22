<script lang="ts">
	import { PdfcnThemeProvider } from '$lib/index';
	import { professionalTheme } from '$lib/themes';
	import { Document, Page, Watermark, Heading, Text } from '$lib/bases/takumi';
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
</script>

<PdfcnThemeProvider {theme}>
	<Document title="Watermark example">
		<Page flow size="A4" margin={48}>
			<Watermark text="DRAFT" opacity={0.12} /><Heading>Proposal</Heading><Text
				>For review before approval.</Text
			>
		</Page>
	</Document>
</PdfcnThemeProvider>
