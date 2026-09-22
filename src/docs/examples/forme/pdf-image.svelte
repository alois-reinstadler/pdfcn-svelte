<script lang="ts">
	import { PdfcnThemeProvider } from '$lib/index';
	import { professionalTheme } from '$lib/themes';
	import { Document, Page, PdfImage } from '$lib/bases/forme';
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
	// A self-contained PNG works without network access or server filesystem paths.
	const src =
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
</script>

<PdfcnThemeProvider {theme}>
	<Document title="Pdf Image example">
		<Page size="A4" margin={48}>
			<PdfImage
				{src}
				width={80}
				height={80}
				fit="contain"
				caption="Replace with your PNG or JPEG"
			/>
		</Page>
	</Document>
</PdfcnThemeProvider>
