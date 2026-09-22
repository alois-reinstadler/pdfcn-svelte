<script lang="ts">
	import { PdfcnThemeProvider } from '$lib/index';
	import { professionalTheme } from '$lib/themes';
	import { Document, Page, Link } from '$lib/bases/takumi';
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
	<Document title="Link example">
		<Page flow size="A4" margin={48}>
			<Link href="https://example.com/invoices" variant="primary"
				>View your invoices</Link
			>
		</Page>
	</Document>
</PdfcnThemeProvider>
