<script lang="ts">
	import { PdfcnThemeProvider } from '$lib/index';
	import { professionalTheme } from '$lib/themes';
	import {
		Document,
		Page,
		KeepTogether,
		View,
		Heading,
		Text
	} from '$lib/bases/takumi';
	// Built-in sans-serif fallback avoids a network font dependency in this example.
	const theme = {
		...professionalTheme,
		typography: {
			...professionalTheme.typography,
			body: { ...professionalTheme.typography.body, fontFamily: 'sans-serif' },
			heading: {
				...professionalTheme.typography.heading,
				fontFamily: 'sans-serif'
			}
		}
	};
</script>

<PdfcnThemeProvider {theme}>
	<Document title="Keep Together example">
		<Page flow size="A5" margin={48}>
			<Text>Previous section: the space below simulates a nearly full page.</Text>
			<View style={{ height: 430 }} />
			<KeepTogether
				><Heading level={2}>Approval</Heading><Text
					>This short section should stay on one physical page.</Text
				></KeepTogether
			>
		</Page>
	</Document>
</PdfcnThemeProvider>
