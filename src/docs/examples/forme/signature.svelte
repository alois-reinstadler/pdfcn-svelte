<script lang="ts">
	import { PdfcnThemeProvider } from '$lib/index';
	import { professionalTheme } from '$lib/themes';
	import { Document, Page, PrintableSignature } from '$lib/bases/forme';
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
	<Document title="PrintableSignature example">
		<Page size="A4" margin={48}>
			<PrintableSignature
				variant="double"
				signers={[
					{ name: 'Ada Lovelace', label: 'Approved by' },
					{ name: 'Alex Morgan', label: 'Prepared by' }
				]}
			/>
		</Page>
	</Document>
</PdfcnThemeProvider>
