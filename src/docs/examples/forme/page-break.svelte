<script lang="ts">
	import { PdfcnThemeProvider } from '$lib/index';
	import { professionalTheme } from '$lib/themes';
	import { Document, Page, Heading, Text, PageBreak } from '$lib/bases/forme';
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
	<Document title="Page Break example">
		<Page size="A4" margin={48}>
			<Heading>First section</Heading><Text>Before the break.</Text><PageBreak
			/><Heading>Second section</Heading><Text>After the break.</Text>
		</Page>
	</Document>
</PdfcnThemeProvider>
