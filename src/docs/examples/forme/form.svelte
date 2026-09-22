<script lang="ts">
	import { PdfcnThemeProvider } from '$lib/index';
	import { professionalTheme } from '$lib/themes';
	import { Document, Page, Form, type PdfFormGroup } from '$lib/bases/forme';
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
		<Page size="A4" margin={48}>
			<Form title="Registration" {groups} variant="box" />
		</Page>
	</Document>
</PdfcnThemeProvider>
