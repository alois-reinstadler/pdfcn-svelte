<script lang="ts">
	import { PdfcnThemeProvider, modernTheme } from 'pdfcn-svelte';
	import {
		Document,
		Page,
		Stack,
		Text
	} from 'pdfcn-svelte/bases/takumi';
</script>

<PdfcnThemeProvider theme={modernTheme}>
	<Document title="Fresh Takumi consumer">
		<Page size="A4" style={{ padding: 36 }}>
			<Stack gap="sm">
				<Text variant="xl" weight="bold">Packed Takumi import</Text>
				<Text noMargin>The installed npm tarball rendered this page.</Text>
			</Stack>
		</Page>
	</Document>
</PdfcnThemeProvider>
