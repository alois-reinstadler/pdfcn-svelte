<script lang="ts">
	import { PdfcnThemeProvider } from '$lib/index';
	import { professionalTheme } from '$lib/themes';
	import { Document, Page, KeyValue } from '$lib/bases/takumi';
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
	<Document title="Key Value example">
		<Page flow size="A4" margin={48}>
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
