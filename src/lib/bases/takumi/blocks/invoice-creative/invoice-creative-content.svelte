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

	import type { InvoiceCreativeData } from './invoice-creative.types';

	let { data }: { data: InvoiceCreativeData } = $props();
	const theme = usePdfcnTheme();
	const pageStyle = { backgroundColor: theme.colors.background, boxSizing: 'border-box', minHeight: 841,
		padding: theme.spacing.page.marginTop, paddingBottom: theme.spacing.page.marginBottom, position: 'relative' };
	const sectionLabelStyle = { color: theme.colors.accent, fontSize: 8, fontWeight: 'bold', letterSpacing: 0.8, marginBottom: 6, textTransform: 'uppercase' };
</script>

<Document title={`Invoice ${data.invoiceNumber}`}>
	<Page size="A4" style={pageStyle}>
		<View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.sectionGap }}>
			<View style={{ flex: 1 }}><PageHeader variant="centered" title={data.companyName} subtitle={`${data.subtitle}  ·  ${data.companyAddress}`} marginBottom={0} /></View>
			<View style={{ alignItems: 'center', backgroundColor: theme.colors.primary, borderRadius: theme.primitives.borderRadius.md, paddingHorizontal: 20, paddingVertical: 14 }}>
				<Text style={{ color: theme.colors.primaryForeground, fontSize: 8, fontWeight: 'bold', letterSpacing: 1.2, marginBottom: 2, textTransform: 'uppercase' }} noMargin>Invoice</Text>
				<Text style={{ color: theme.colors.primaryForeground, fontSize: 16, fontWeight: 'bold' }} noMargin>{data.invoiceNumber}</Text>
			</View>
		</View>
		<View style={{ backgroundColor: theme.colors.muted, borderLeftColor: theme.colors.accent, borderLeftStyle: 'solid', borderLeftWidth: 4, marginBottom: theme.spacing.sectionGap, paddingLeft: 14, paddingVertical: 10 }}>
			<View style={{ flexDirection: 'row', gap: 32 }}>
				<View style={{ flex: 1 }}><Text style={sectionLabelStyle} noMargin>Billed To</Text><Text variant="sm" weight="semibold" noMargin>{data.billTo.name}</Text>
					<Text variant="xs" noMargin color="mutedForeground">{data.billTo.address}</Text><Text variant="xs" noMargin color="mutedForeground">{data.billTo.email} · {data.billTo.phone}</Text>
				</View>
				<View style={{ flex: 1 }}><Text style={sectionLabelStyle} noMargin>Invoice Info</Text><KeyValue size="sm" items={[
					{ key: 'Issue Date', value: data.invoiceDate }, { key: 'Due Date', value: data.dueDate }, { key: 'Payment', value: data.paymentTerms.method }
				]} /></View>
			</View>
		</View>
		<Table variant="striped" zebraStripe><TableHeader><TableRow header><TableCell text="Deliverable" /><TableCell align="center" text="Qty" /><TableCell align="right" text="Rate" /><TableCell align="right" text="Amount" /></TableRow></TableHeader>
			<TableBody>{#each data.items as item}<TableRow><TableCell text={item.description} /><TableCell align="center" text={`${item.quantity}`} /><TableCell align="right" text={`$${item.unitPrice.toLocaleString()}`} /><TableCell align="right" text={`$${(item.quantity * item.unitPrice).toLocaleString()}`} /></TableRow>{/each}</TableBody>
		</Table>
		<Section noWrap style={{ flexDirection: 'row', marginTop: 24 }}>
			<View style={{ flex: 1, paddingRight: 20 }}><Text style={sectionLabelStyle} noMargin>Notes & Terms</Text><Text variant="xs" color="mutedForeground">{data.notes}</Text><Text variant="xs" color="mutedForeground" style={{ marginTop: 4 }}>GST: {data.paymentTerms.gst}</Text></View>
			<View style={{ backgroundColor: theme.colors.muted, borderRadius: theme.primitives.borderRadius.sm, padding: 14, width: 240 }}><KeyValue size="sm" dividerThickness={1} divided items={[
				{ key: 'Subtotal', value: `$${data.summary.subtotal.toLocaleString()}` }, { key: 'Tax (6.5%)', value: `$${data.summary.tax.toFixed(2)}` },
				{ key: 'Total', keyStyle: { fontSize: 13, fontWeight: 'bold' }, value: `$${data.summary.total.toFixed(2)}`, valueStyle: { color: theme.colors.accent, fontSize: 14, fontWeight: 'bold' } }
			]} /></View>
		</Section>
		<PageFooter variant="centered" leftText="Thank you for choosing us for your creative needs!" sticky pagePadding={25} />
	</Page>
</Document>
