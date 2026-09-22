<script lang="ts">
	import { PdfcnThemeProvider } from '$lib/index';
	import { professionalTheme } from '$lib/themes';
	import {
		Document,
		Page,
		Table,
		TableHeader,
		TableBody,
		TableRow,
		TableCell
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
	<Document title="Table example">
		<Page size="A4" margin={48}>
			<Table variant="line">
				<TableHeader
					><TableRow header
						><TableCell header width={300} text="Service" /><TableCell
							header
							width={130}
							align="right"
							text="Hours"
						/></TableRow
					></TableHeader
				>
				<TableBody
					><TableRow
						><TableCell width={300} text="Consultation" /><TableCell
							width={130}
							align="right"
							text="2"
						/></TableRow
					></TableBody
				>
			</Table>
		</Page>
	</Document>
</PdfcnThemeProvider>
