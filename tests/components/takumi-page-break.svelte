<script lang="ts">
	import PdfcnThemeProvider from '$lib/PdfcnThemeProvider.svelte';
	import { Document, Page, PageBreak, Text } from '$lib/bases/takumi';
	import { modernTheme } from '$lib/themes/modern';
</script>

<PdfcnThemeProvider theme={modernTheme}>
	<Document title="Component contract: Takumi PageBreak">
		<Page style={{ padding: 24 }}>
			<Text>CMP:before-page-break</Text>
			<PageBreak />
			<Text>CMP:page-break</Text>
		</Page>
	</Document>
</PdfcnThemeProvider>
