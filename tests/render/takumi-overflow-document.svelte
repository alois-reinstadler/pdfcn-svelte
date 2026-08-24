<script lang="ts">
	import PdfcnThemeProvider from '$lib/PdfcnThemeProvider.svelte';
	import Text from '$lib/bases/takumi/components/text/text.svelte';
	import Document from '$lib/bases/takumi/lib/Document.svelte';
	import { modernTheme } from '$lib/themes/modern';

	interface Props {
		lineCount: number;
	}

	let { lineCount }: Props = $props();
	const lines = $derived(Array.from({ length: lineCount }, (_, index) => index + 1));
</script>

<PdfcnThemeProvider theme={modernTheme}>
	<Document title="pdfcn-svelte Takumi overflow test" style={{ padding: 12 }}>
		{#each lines as line}
			<Text noMargin style={{ flexShrink: 0, fontSize: 10, height: 18, lineHeight: 1.5 }}>
				Overflow row {line}
			</Text>
		{/each}
	</Document>
</PdfcnThemeProvider>
