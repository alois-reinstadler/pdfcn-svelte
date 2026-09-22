<script lang="ts">
	import { PdfcnThemeProvider } from '$lib/index';
	import { professionalTheme } from '$lib/themes';
	import {
		Document,
		Page,
		DataTable,
		Text,
		type DataTableColumn
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
	type Line = { description: string; quantity: number; unitPrice: number };
	const rows: Line[] = [
		{ description: 'Design consultation', quantity: 2, unitPrice: 150 }
	];
	const money = (amount: number) =>
		new Intl.NumberFormat('de-AT', {
			style: 'currency',
			currency: 'EUR'
		}).format(amount);
	const columns: DataTableColumn<Line>[] = [
		{ key: 'description', header: 'Description', width: 240 },
		{ key: 'quantity', header: 'Qty', width: 60, align: 'right' },
		{
			key: 'unitPrice',
			header: 'Amount',
			width: 130,
			align: 'right',
			render: amount
		}
	];
</script>

{#snippet amount(_value: unknown, row: Line)}
	<Text noMargin align="right">{money(row.quantity * row.unitPrice)}</Text>
{/snippet}

<PdfcnThemeProvider {theme}>
	<Document title="Data Table example">
		<Page flow size="A4" margin={48}>
			<DataTable {columns} data={rows} variant="line" stripe />
		</Page>
	</Document>
</PdfcnThemeProvider>
