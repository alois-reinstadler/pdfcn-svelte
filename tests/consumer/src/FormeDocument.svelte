<script lang="ts">
	import { PdfcnThemeProvider, modernTheme } from 'pdfcn-svelte';
	import {
		Document,
		Page,
		Stack,
		Text
	} from 'pdfcn-svelte/bases/forme';
</script>

<PdfcnThemeProvider theme={modernTheme}>
	<Document title="Fresh Forme consumer">
		<Page size="A4" margin={36}>
			<Stack gap="sm">
				<Text variant="xl" weight="bold">Packed Forme import</Text>
				<Text noMargin>The installed npm tarball rendered this page.</Text>
			</Stack>
		</Page>
	</Document>
</PdfcnThemeProvider>
