<script lang="ts">
	import { PdfcnThemeProvider } from '$lib/index';
	import { professionalTheme } from '$lib/themes';
	import {
		Document,
		Page,
		Heading,
		Text,
		PageFooter,
		PageBreak,
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
	<Document title="Page Footer example">
		<Page flow size="A4" margin={48}>
			<Heading>Account summary</Heading><Text>Prepared for Ada Lovelace.</Text>
			<PageBreak /><Text>Second physical page with the same footer.</Text>
			<PageFooter fixed marginTop={0} leftText="Acme Studio"
				>{#snippet rightText()}<PageNumber />{/snippet}</PageFooter
			>
		</Page>
	</Document>
</PdfcnThemeProvider>
