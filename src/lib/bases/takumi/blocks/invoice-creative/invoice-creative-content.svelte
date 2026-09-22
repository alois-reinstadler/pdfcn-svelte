<script lang="ts">
	import PageNumber from '$lib/bases/takumi/components/page-number/page-number.svelte';
	import { invoiceFormatter } from '$lib/utils/invoice-format';
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
	const money = $derived(invoiceFormatter(data));
	const pageStyle = { backgroundColor: theme.colors.background, boxSizing: 'border-box', minHeight: 841,
		padding: theme.spacing.page.marginTop, paddingBottom: theme.spacing.page.marginBottom, position: 'relative' };
	const sectionLabelStyle = { color: theme.colors.accent, fontSize: 8, fontWeight: 'bold', letterSpacing: 0.8, marginBottom: 6, textTransform: 'uppercase' };
</script>

{#snippet pageNumber()}<PageNumber align="right" size="xs" />{/snippet}

<Document title={`Invoice ${data.invoiceNumber}`}>
	<Page flow size="A4" margin={{ top: theme.spacing.page.marginTop, right: theme.spacing.page.marginRight, bottom: Math.max(theme.spacing.page.marginBottom, 48), left: theme.spacing.page.marginLeft }} style={pageStyle}>
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
		<Table variant="striped" zebraStripe><TableHeader><TableRow header><TableCell width="48%" text="Deliverable" /><TableCell width="12%" align="center" text="Qty" /><TableCell width="20%" align="right" text="Rate" /><TableCell width="20%" align="right" text="Amount" /></TableRow></TableHeader>
			<TableBody>{#each data.items as item}<TableRow><TableCell width="48%" text={item.description} /><TableCell width="12%" align="center" text={`${item.quantity}`} /><TableCell width="20%" align="right" text={money(item.unitPrice)} /><TableCell width="20%" align="right" text={money((item.quantity * item.unitPrice))} /></TableRow>{/each}</TableBody>
		</Table>
		<Section noWrap style={{ flexDirection: 'row', marginTop: 24 }}>
			<View style={{ flex: 1, paddingRight: 20 }}><Text style={sectionLabelStyle} noMargin>Notes & Terms</Text><Text variant="xs" color="mutedForeground">{data.notes}</Text><Text variant="xs" color="mutedForeground" style={{ marginTop: 4 }}>GST: {data.paymentTerms.gst}</Text></View>
			<View style={{ backgroundColor: theme.colors.muted, borderRadius: theme.primitives.borderRadius.sm, padding: 14, width: 240 }}><KeyValue size="sm" dividerThickness={1} divided items={[
				{ key: 'Subtotal', value: money(data.summary.subtotal) }, { key: data.taxLabel ?? 'Tax', value: money(data.summary.tax) },
				{ key: 'Total', keyStyle: { fontSize: 13, fontWeight: 'bold' }, value: money(data.summary.total), valueStyle: { color: theme.colors.accent, fontSize: 14, fontWeight: 'bold' } }
			]} /></View>
		</Section>
		<PageFooter rightText={pageNumber} variant="centered" leftText="Thank you for choosing us for your creative needs!" sticky pagePadding={25} />
	</Page>
</Document>
