<script lang="ts">
	import KeyValue from '$lib/bases/takumi/components/key-value/key-value.svelte';
	import PageFooter from '$lib/bases/takumi/components/page-footer/page-footer.svelte';
	import PageHeader from '$lib/bases/takumi/components/page-header/page-header.svelte';
	import Section from '$lib/bases/takumi/components/section/section.svelte';
	import Table from '$lib/bases/takumi/components/table/table.svelte';
	import TableBody from '$lib/bases/takumi/components/table/table-body.svelte';
	import TableCell from '$lib/bases/takumi/components/table/table-cell.svelte';
	import TableHeader from '$lib/bases/takumi/components/table/table-header.svelte';
	import TableRow from '$lib/bases/takumi/components/table/table-row.svelte';
	import Text from '$lib/bases/takumi/components/text/text.svelte';
	import Document from '$lib/bases/takumi/lib/Document.svelte';
	import Page from '$lib/bases/takumi/lib/Page.svelte';
	import View from '$lib/bases/takumi/lib/View.svelte';
	import { usePdfcnTheme } from '$lib/theme-provider.svelte';

	import type { InvoiceModernData } from './invoice-modern.types';

	let { data }: { data: InvoiceModernData } = $props();
	const theme = usePdfcnTheme();
	const pageStyle = { backgroundColor: theme.colors.background, boxSizing: 'border-box', minHeight: 841,
		padding: theme.spacing.page.marginTop, paddingBottom: theme.spacing.page.marginBottom, position: 'relative' };
	const metaLabelStyle = { color: theme.colors.mutedForeground, fontSize: 8, fontWeight: 'bold', letterSpacing: 0.5, marginBottom: 3, textTransform: 'uppercase' };
	const metaValueStyle = { color: theme.colors.foreground, fontSize: 9 };
</script>

<Document title={`Invoice ${data.invoiceNumber}`}>
	<Page size="A4" style={pageStyle}>
		<PageHeader variant="branded" title={data.companyName} subtitle={`${data.subtitle}  ·  ${data.companyAddress}  ·  ${data.companyEmail}`} />
		<View style={{ flexDirection: 'row', marginBottom: theme.spacing.sectionGap }}>
			<View style={{ flex: 1, paddingRight: 12 }}><Text style={metaLabelStyle} noMargin>Invoice Number</Text><Text style={{ ...metaValueStyle, fontSize: 11, fontWeight: 'bold' }} noMargin>{data.invoiceNumber}</Text></View>
			<View style={{ flex: 1, paddingRight: 12 }}><Text style={metaLabelStyle} noMargin>Invoice Date</Text><Text style={metaValueStyle} noMargin>{data.invoiceDate}</Text></View>
			<View style={{ flex: 1, paddingRight: 12 }}><Text style={metaLabelStyle} noMargin>Due Date</Text><Text style={metaValueStyle} noMargin>{data.dueDate}</Text></View>
			<View style={{ backgroundColor: theme.colors.border, marginRight: 12, width: 1 }} />
			<View style={{ flex: 2 }}><Text style={metaLabelStyle} noMargin>Billed To</Text><Text style={{ ...metaValueStyle, fontWeight: 'bold' }} noMargin>{data.billTo.name}</Text>
				<Text style={{ ...metaValueStyle, color: theme.colors.mutedForeground }} noMargin>{data.billTo.address}</Text><Text style={{ ...metaValueStyle, color: theme.colors.mutedForeground }} noMargin>{data.billTo.email}</Text><Text style={{ ...metaValueStyle, color: theme.colors.mutedForeground }} noMargin>{data.billTo.phone}</Text>
			</View>
		</View>
		<Table variant="primary-header"><TableHeader><TableRow header><TableCell text="Description" /><TableCell align="center" text="Qty" /><TableCell align="right" text="Unit Price" /><TableCell align="right" text="Amount" /></TableRow></TableHeader>
			<TableBody>{#each data.items as item}<TableRow><TableCell text={item.description} /><TableCell align="center" text={`${item.quantity}`} /><TableCell align="right" text={`$${item.unitPrice.toLocaleString()}`} /><TableCell align="right" text={`$${(item.quantity * item.unitPrice).toFixed(2)}`} /></TableRow>{/each}</TableBody>
		</Table>
		<Section noWrap style={{ flexDirection: 'row', marginTop: 16 }}>
			<View style={{ flex: 1, paddingRight: 20 }}><Text style={metaLabelStyle} noMargin>Payment Method</Text><Text variant="xs" noMargin>{data.paymentTerms.method}</Text><Text variant="xs" noMargin color="mutedForeground">{data.paymentTerms.gst}</Text></View>
			<View style={{ width: 220 }}><KeyValue size="sm" dividerThickness={1} divided items={[
				{ key: 'Subtotal', value: `$${data.summary.subtotal.toFixed(2)}` }, { key: 'Tax (7%)', value: `$${data.summary.tax.toFixed(2)}` },
				{ key: 'Total Due', keyStyle: { fontSize: 12, fontWeight: 'bold' }, value: `$${data.summary.total.toFixed(2)}`, valueStyle: { fontSize: 12, fontWeight: 'bold' } }
			]} /></View>
		</Section>
		<PageFooter leftText={data.notes} rightText="Page 1 of 1" sticky pagePadding={25} />
	</Page>
</Document>
