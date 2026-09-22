<script lang="ts">
	import { PdfcnThemeProvider } from '$lib/index';
	import { professionalTheme } from '$lib/themes';
	import {
		Document,
		Page,
		Text,
		PageBreak,
		PageFooter,
		PageNumber
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
	<Document title="Page Number example">
		<Page flow size="A4" margin={48}>
			<Text>First physical page.</Text><PageBreak /><Text
				>Second physical page.</Text
			>
			<PageFooter leftText="Account summary"
				>{#snippet rightText()}<PageNumber
						format={'Page {page} of {total}'}
					/>{/snippet}</PageFooter
			>
		</Page>
	</Document>
</PdfcnThemeProvider>
