<script lang="ts">
	import PageNumber from '$lib/bases/takumi/components/page-number/page-number.svelte';
	import { invoiceFormatter } from '$lib/utils/invoice-format';
	import KeyValue from '$lib/bases/takumi/components/key-value/key-value.svelte';
	import PageFooter from '$lib/bases/takumi/components/page-footer/page-footer.svelte';
	import PageHeader from '$lib/bases/takumi/components/page-header/page-header.svelte';
	import PdfImage from '$lib/bases/takumi/components/pdf-image/pdf-image.svelte';
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

	import type { InvoiceCorporateData } from './invoice-corporate.types';

	let { data }: { data: InvoiceCorporateData } = $props();
	const theme = usePdfcnTheme();
	const money = $derived(invoiceFormatter(data));
	const pageStyle = { backgroundColor: theme.colors.background, boxSizing: 'border-box', position: 'relative' };
	const infoLabelStyle = { color: theme.colors.mutedForeground, fontSize: 9, fontWeight: 'bold', letterSpacing: 0.6, marginBottom: 6, textTransform: 'uppercase' };
</script>

{#snippet logo()}
	{#if data.logo}
		<PdfImage src={data.logo} width={56} height={56} style={{ margin: 0 }} />
	{:else}
		<View style={{ alignItems: 'center', backgroundColor: theme.colors.primary, borderRadius: 8, height: 56, justifyContent: 'center', width: 56 }}>
			<Text color="primaryForeground" noMargin weight="bold">PDF</Text>
		</View>
	{/if}
{/snippet}

{#snippet pageNumber()}<PageNumber align="right" size="xs" />{/snippet}

<Document title={`Invoice ${data.invoiceNumber}`}>
	<Page flow size="A4" margin={{ top: theme.spacing.page.marginTop, right: theme.spacing.page.marginRight, bottom: Math.max(theme.spacing.page.marginBottom, 72), left: theme.spacing.page.marginLeft }} style={pageStyle}>
		<PageHeader variant="logo-right" {logo} title={data.companyName} subtitle={`${data.subtitle}  ·  ${data.companyAddress}`} style={{ marginBottom: theme.spacing.sectionGap }} />
		<View style={{ flexDirection: 'row', gap: 24, marginBottom: theme.spacing.sectionGap }}>
			<View style={{ flex: 1 }}><Text style={infoLabelStyle} noMargin>Invoice Details</Text><KeyValue size="sm" items={[
				{ key: 'Invoice #', value: data.invoiceNumber }, { key: 'Issue Date', value: data.invoiceDate }, { key: 'Due Date', value: data.dueDate }, { key: 'Payment', value: data.paymentTerms.method }
			]} /></View>
			<View style={{ flex: 1 }}><Text style={infoLabelStyle} noMargin>Bill To</Text><Text variant="sm" weight="semibold" noMargin>{data.billTo.name}</Text>
				<Text variant="xs" noMargin color="mutedForeground">{data.billTo.address}</Text><Text variant="xs" noMargin color="mutedForeground">{data.billTo.email}</Text><Text variant="xs" noMargin color="mutedForeground">{data.billTo.phone}</Text>
			</View>
		</View>
		<Table variant="bordered"><TableHeader><TableRow header><TableCell width="48%" text="Description" /><TableCell width="12%" align="center" text="Qty" /><TableCell width="20%" align="right" text="Unit Price" /><TableCell width="20%" _last align="right" text="Amount" /></TableRow></TableHeader>
			<TableBody>{#each data.items as item}<TableRow><TableCell width="48%" text={item.description} /><TableCell width="12%" align="center" text={`${item.quantity}`} /><TableCell width="20%" align="right" text={money(item.unitPrice)} /><TableCell width="20%" _last align="right" text={money((item.quantity * item.unitPrice))} /></TableRow>{/each}</TableBody>
		</Table>
		<View style={{ backgroundColor: theme.colors.muted, borderRadius: theme.primitives.borderRadius.md, marginTop: 20, padding: 16 }}>
			<View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}><View style={{ width: 260 }}><KeyValue size="md" dividerThickness={1} dividerColor="border" divided items={[
				{ key: 'Subtotal', value: money(data.summary.subtotal) }, { key: data.taxLabel ?? 'Tax', value: money(data.summary.tax) },
				{ key: 'Total Due', keyStyle: { fontSize: 13, fontWeight: 'bold' }, value: money(data.summary.total), valueStyle: { color: theme.colors.primary, fontSize: 14, fontWeight: 'bold' } }
			]} /></View></View>
		</View>
		<PageFooter leftText={data.notes} rightText={pageNumber} sticky />
	</Page>
</Document>
