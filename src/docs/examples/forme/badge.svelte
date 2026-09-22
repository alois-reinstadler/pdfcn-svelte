<script lang="ts">
	import { PdfcnThemeProvider } from '$lib/index';
	import { professionalTheme } from '$lib/themes';
	import { Document, Page, Badge, Stack } from '$lib/bases/forme';
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
	<Document title="Badge example">
		<Page size="A4" margin={48}>
			<Stack direction="horizontal" gap="sm"
				><Badge variant="success" label="Paid" /><Badge variant="outline"
					>Reference copy</Badge
				></Stack
			>
		</Page>
	</Document>
</PdfcnThemeProvider>
