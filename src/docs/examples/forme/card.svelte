<script lang="ts">
	import { PdfcnThemeProvider } from '$lib/index';
	import { professionalTheme } from '$lib/themes';
	import { Document, Page, Card, Text } from '$lib/bases/forme';
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
	<Document title="Card example">
		<Page size="A4" margin={48}>
			<Card title="Delivery" variant="bordered" padding="lg"
				><Text>Delivery takes three business days.</Text></Card
			>
		</Page>
	</Document>
</PdfcnThemeProvider>
