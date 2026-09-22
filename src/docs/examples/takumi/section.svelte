<script lang="ts">
	import { PdfcnThemeProvider } from '$lib/index';
	import { professionalTheme } from '$lib/themes';
	import { Document, Page, Section, Heading, Text } from '$lib/bases/takumi';
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
	<Document title="Section example">
		<Page flow size="A4" margin={48}>
			<Section variant="callout" padding="md"
				><Heading level={3}>Notes</Heading><Text
					>Include the invoice reference with your payment.</Text
				></Section
			>
		</Page>
	</Document>
</PdfcnThemeProvider>
