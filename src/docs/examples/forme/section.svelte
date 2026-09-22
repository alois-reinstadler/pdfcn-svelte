<script lang="ts">
	import { PdfcnThemeProvider } from '$lib/index';
	import { professionalTheme } from '$lib/themes';
	import { Document, Page, Section, Heading, Text } from '$lib/bases/forme';
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
</script>

<PdfcnThemeProvider {theme}>
	<Document title="Section example">
		<Page size="A4" margin={48}>
			<Section variant="callout" padding="md"
				><Heading level={3}>Notes</Heading><Text
					>Include the invoice reference with your payment.</Text
				></Section
			>
		</Page>
	</Document>
</PdfcnThemeProvider>
