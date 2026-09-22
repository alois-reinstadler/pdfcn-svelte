<script lang="ts">
	import { PdfcnThemeProvider } from '$lib/index';
	import { professionalTheme } from '$lib/themes';
	import { Document, Page, Stack, Badge, Text } from '$lib/bases/forme';
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
	<Document title="Stack example">
		<Page size="A4" margin={48}>
			<Stack direction="horizontal" align="center" justify="between" gap="md"
				><Text noMargin>Payment status</Text><Badge
					label="Paid"
					variant="success"
				/></Stack
			>
		</Page>
	</Document>
</PdfcnThemeProvider>
