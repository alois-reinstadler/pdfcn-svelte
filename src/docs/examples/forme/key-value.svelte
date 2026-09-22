<script lang="ts">
	import { PdfcnThemeProvider } from '$lib/index';
	import { professionalTheme } from '$lib/themes';
	import { Document, Page, KeyValue } from '$lib/bases/forme';
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
	<Document title="Key Value example">
		<Page size="A4" margin={48}>
			<KeyValue
				divided
				boldValue
				items={[
					{ key: 'Reference', value: 'INV-2026-01' },
					{ key: 'Due date', value: '5 October 2026' }
				]}
			/>
		</Page>
	</Document>
</PdfcnThemeProvider>
