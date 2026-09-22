<script lang="ts">
	import { PdfcnThemeProvider } from '$lib/index';
	import { professionalTheme } from '$lib/themes';
	import { Document, Page, Form, type PdfFormGroup } from '$lib/bases/takumi';
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
	const groups: PdfFormGroup[] = [
		{
			title: 'Contact',
			layout: 'two-column',
			fields: [
				{ label: 'Full name', hint: 'Print clearly' },
				{ label: 'Email address' }
			]
		}
	];
</script>

<PdfcnThemeProvider {theme}>
	<Document title="Form example">
		<Page flow size="A4" margin={48}>
			<Form title="Registration" {groups} variant="box" />
		</Page>
	</Document>
</PdfcnThemeProvider>
