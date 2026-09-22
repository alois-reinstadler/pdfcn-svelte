<script lang="ts">
	import { PdfcnThemeProvider } from '$lib/index';
	import { professionalTheme } from '$lib/themes';
	import { Document, Page, List } from '$lib/bases/forme';
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
	<Document title="List example">
		<Page size="A4" margin={48}>
			<List
				variant="checklist"
				items={[
					{ text: 'Review totals', checked: true },
					{ text: 'Approve payment', checked: false }
				]}
			/>
		</Page>
	</Document>
</PdfcnThemeProvider>
