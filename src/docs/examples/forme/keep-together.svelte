<script lang="ts">
	import { PdfcnThemeProvider } from '$lib/index';
	import { professionalTheme } from '$lib/themes';
	import {
		Document,
		Page,
		KeepTogether,
		Heading,
		Text
	} from '$lib/bases/forme';
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
	<Document title="Keep Together example">
		<Page size="A4" margin={48}>
			<KeepTogether
				><Heading level={2}>Approval</Heading><Text
					>This short section should stay on one physical page.</Text
				></KeepTogether
			>
		</Page>
	</Document>
</PdfcnThemeProvider>
