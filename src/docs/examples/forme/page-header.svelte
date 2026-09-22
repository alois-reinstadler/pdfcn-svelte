<script lang="ts">
	import { PdfcnThemeProvider } from '$lib/index';
	import { professionalTheme } from '$lib/themes';
	import { Document, Page, PageHeader, Text } from '$lib/bases/forme';
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
	<Document title="Page Header example">
		<Page size="A4" margin={48}>
			<PageHeader
				title="Acme Studio"
				subtitle="Account summary"
				rightText="September 2026"
			/><Text>Prepared for Ada Lovelace.</Text>
		</Page>
	</Document>
</PdfcnThemeProvider>
