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

	import type { InvoiceMinimalData } from './invoice-minimal.types';

	let { data }: { data: InvoiceMinimalData } = $props();
	const theme = usePdfcnTheme();
	const money = $derived(invoiceFormatter(data));
	const pageStyle = { backgroundColor: theme.colors.background, boxSizing: 'border-box', position: 'relative' };
	const infoLabelStyle = { color: theme.colors.primary, fontSize: 8, fontWeight: 'bold', letterSpacing: 0.8, marginBottom: 4, textTransform: 'uppercase' };
</script>

{#snippet pageNumber()}<PageNumber align="right" size="xs" />{/snippet}

<Document title={`Invoice ${data.invoiceNumber}`}>
	<Page flow size="A4" margin={{ top: theme.spacing.page.marginTop, right: theme.spacing.page.marginRight, bottom: Math.max(theme.spacing.page.marginBottom, 48), left: theme.spacing.page.marginLeft }} style={pageStyle}>
		<Section noWrap style={{ alignItems: 'flex-start', flexDirection: 'row', marginBottom: theme.spacing.sectionGap }}>
			<View style={{ flex: 1 }}><PageHeader variant="minimal" title={data.companyName} subtitle={`${data.companyAddress}  ·  ${data.companyEmail}`} marginBottom={0} /></View>
			<View style={{ alignSelf: 'flex-start', borderColor: theme.colors.primary, borderRadius: theme.primitives.borderRadius.sm, borderStyle: 'solid', borderWidth: 2, paddingHorizontal: 12, paddingVertical: 8 }}>
				<Text style={{ color: theme.colors.primary, fontSize: 7, fontWeight: 'bold', textAlign: 'right' }} noMargin transform="uppercase">Invoice</Text>
				<Text style={{ color: theme.colors.foreground, fontSize: 14, fontWeight: 'bold', textAlign: 'right' }} noMargin>{data.invoiceNumber}</Text>
				<Text style={{ color: theme.colors.mutedForeground, fontSize: 8, textAlign: 'right' }} noMargin>{data.invoiceDate}</Text>
			</View>
		</Section>
		<View style={{ flexDirection: 'row', marginBottom: theme.spacing.sectionGap }}>
			<View style={{ paddingRight: 20, width: '50%' }}>
				<Text style={infoLabelStyle} noMargin>Bill To</Text><Text variant="sm" noMargin>{data.billTo.name}</Text>
				<Text variant="xs" noMargin color="mutedForeground">{data.billTo.address}</Text><Text variant="xs" noMargin color="mutedForeground">{data.billTo.email}</Text><Text variant="xs" noMargin color="mutedForeground">{data.billTo.phone}</Text>
			</View>
			<View style={{ width: '50%' }}><Text style={infoLabelStyle} noMargin>Invoice Details</Text><KeyValue size="sm" items={[
				{ key: 'Due Date', value: data.dueDate }, { key: 'Payment', value: data.paymentTerms.method }, { key: 'GST', value: data.paymentTerms.gst }
			]} /></View>
		</View>
		<Table variant="compact"><TableHeader><TableRow header><TableCell width="48%" text="Description" /><TableCell width="12%" align="center" text="Qty" /><TableCell width="20%" align="right" text="Rate" /><TableCell width="20%" align="right" text="Total" /></TableRow></TableHeader>
			<TableBody>{#each data.items as item}<TableRow><TableCell width="48%" text={item.description} /><TableCell width="12%" align="center" text={`${item.quantity}`} /><TableCell width="20%" align="right" text={money(item.unitPrice)} /><TableCell width="20%" align="right" text={money((item.quantity * item.unitPrice))} /></TableRow>{/each}</TableBody>
		</Table>
		<Section noWrap style={{ flexDirection: 'row', marginTop: 20 }}><View style={{ flex: 1 }} /><View style={{ width: 240 }}><KeyValue size="sm" dividerThickness={1} divided items={[
			{ key: 'Subtotal', value: money(data.summary.subtotal) }, { key: data.taxLabel ?? 'Tax', value: money(data.summary.tax) },
			{ key: 'Balance Due', keyStyle: { fontSize: 12, fontWeight: 'bold' }, value: money(data.summary.total), valueStyle: { color: theme.colors.primary, fontSize: 13, fontWeight: 'bold' } }
		]} /></View></Section>
		<PageFooter leftText={data.notes} rightText={pageNumber} sticky pagePadding={25} />
	</Page>
</Document>
