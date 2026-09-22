<script lang="ts">
	import { PdfcnThemeProvider } from '$lib/index';
	import { professionalTheme } from '$lib/themes';
	import { Document, Page, Signature } from '$lib/bases/takumi';
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
	<Document title="Signature example">
		<Page flow size="A4" margin={48}>
			<Signature
				variant="double"
				signers={[
					{ name: 'Ada Lovelace', label: 'Approved by' },
					{ name: 'Alex Morgan', label: 'Prepared by' }
				]}
			/>
		</Page>
	</Document>
</PdfcnThemeProvider>
