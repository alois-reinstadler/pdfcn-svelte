<script lang="ts">
	import PdfcnThemeProvider from '$lib/PdfcnThemeProvider.svelte';
	import List from '$lib/bases/forme/components/list/list.svelte';
	import PdfImage from '$lib/bases/forme/components/pdf-image/pdf-image.svelte';
	import Document from '$lib/bases/forme/lib/Document.svelte';
	import Page from '$lib/bases/forme/lib/Page.svelte';
</script>

<PdfcnThemeProvider>
	<Document title="Forme parity regressions">
		<Page size="A4">
			<List variant="checklist" items={[{ checked: true, text: 'Checklist spacing contract' }]} />
			<PdfImage
				src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="
				width={1}
				height={1}
			/>
		</Page>
	</Document>
</PdfcnThemeProvider>
