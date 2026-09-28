<script lang="ts">
	import { PdfcnThemeProvider } from '$lib/index';
	import { professionalTheme } from '$lib/themes';
	import {
		Document,
		Page,
		Heading,
		Text,
		PageFooter,
		PageBreak,
		PAGE_NUMBER,
		TOTAL_PAGES
	} from '$lib/bases/forme';
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
	<Document title="Page Footer example">
		<Page size="A4" margin={48}>
			<PageFooter
				fixed
				marginTop={0}
				leftText="Acme Studio"
				rightText={`Page ${PAGE_NUMBER} of ${TOTAL_PAGES}`}
			/>
			<Heading>Account summary</Heading><Text>Prepared for Ada Lovelace.</Text>
			<PageBreak /><Text>Second physical page with the same footer.</Text>
		</Page>
	</Document>
</PdfcnThemeProvider>
