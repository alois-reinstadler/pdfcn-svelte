<script lang="ts">
	import PageNumber from '$lib/bases/takumi/components/page-number/page-number.svelte';
	import { invoiceFormatter } from '$lib/utils/invoice-format';
	import KeyValue from '$lib/bases/takumi/components/key-value/key-value.svelte';
	import PageFooter from '$lib/bases/takumi/components/page-footer/page-footer.svelte';
	import PageHeader from '$lib/bases/takumi/components/page-header/page-header.svelte';
	import PdfImage from '$lib/bases/takumi/components/pdf-image/pdf-image.svelte';
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

	import type { InvoiceClassicData } from './invoice-classic.types';

	let { data }: { data: InvoiceClassicData } = $props();
	const theme = usePdfcnTheme();
	const money = $derived(invoiceFormatter(data));
	const pageStyle = {
		backgroundColor: theme.colors.background,
		boxSizing: 'border-box', minHeight: 841, padding: theme.spacing.page.marginTop,
		paddingBottom: theme.spacing.page.marginBottom, position: 'relative'
	};
</script>

{#snippet logo()}
	{#if data.logo}
		<PdfImage src={data.logo} style={{ margin: 0 }} />
	{:else}
		<View style={{ alignItems: 'center', backgroundColor: theme.colors.primary, borderRadius: 8, height: 48, justifyContent: 'center', width: 48 }}>
			<Text color="primaryForeground" noMargin weight="bold">PDF</Text>
		</View>
	{/if}
{/snippet}

{#snippet pageNumber()}<PageNumber align="right" size="xs" />{/snippet}

<Document title={`Invoice ${data.invoiceNumber}`}>
	<Page flow size="A4" margin={{ top: theme.spacing.page.marginTop, right: theme.spacing.page.marginRight, bottom: Math.max(theme.spacing.page.marginBottom, 48), left: theme.spacing.page.marginLeft }} style={pageStyle}>
		<PageHeader variant="logo-left" {logo} title={data.companyName} subtitle={data.subtitle}
			rightText={data.invoiceNumber} rightSubText={`Due: ${data.dueDate}`} style={{ marginBottom: 0 }} />
		<Section noWrap style={{ flexDirection: 'row' }}>
			<View style={{ flex: 1, paddingRight: 15 }}>
				<Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 2 }} color="mutedForeground" transform="uppercase" noMargin>From</Text>
				<Text noMargin variant="xs">{data.companyName}</Text><Text noMargin variant="xs">{data.companyAddress}</Text><Text noMargin variant="xs">{data.companyEmail}</Text>
			</View>
			<View style={{ flex: 1, paddingRight: 15 }}>
				<Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 2 }} color="mutedForeground" transform="uppercase" noMargin>Bill To</Text>
				<Text noMargin variant="xs">{data.billTo.name}</Text><Text noMargin variant="xs">{data.billTo.address}</Text><Text noMargin variant="xs">{data.billTo.email}</Text>
			</View>
			<View style={{ flex: 1, paddingRight: 15 }}>
				<Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 2 }} color="mutedForeground" transform="uppercase" noMargin>Payment Terms</Text>
				<Text noMargin variant="xs">{data.paymentTerms.method}</Text><Text noMargin variant="xs">{data.paymentTerms.gst}</Text><Text noMargin variant="xs">{data.paymentTerms.dueDate}</Text>
			</View>
		</Section>
		<Table variant="grid" zebraStripe>
			<TableHeader><TableRow header><TableCell width="48%" text="Description" /><TableCell width="12%" align="center" text="QTY" /><TableCell width="20%" align="right" text="Rate" /><TableCell width="20%" _last align="right" text="Total" /></TableRow></TableHeader>
			<TableBody>{#each data.items as item}<TableRow><TableCell width="48%" text={item.description} /><TableCell width="12%" align="center" text={`${item.quantity}`} /><TableCell width="20%" align="right" text={money(item.unitPrice)} /><TableCell width="20%" _last align="right" text={money((item.quantity * item.unitPrice))} /></TableRow>{/each}</TableBody>
		</Table>
		<Section noWrap style={{ flexDirection: 'row', marginTop: 16 }}>
			<View style={{ marginLeft: 'auto', width: 220 }}><KeyValue size="sm" dividerThickness={1} divided items={[
				{ key: 'Subtotal', value: money(data.summary.subtotal) },
				{ key: data.taxLabel ?? 'Tax', value: money(data.summary.tax) },
				{ key: 'Total', keyStyle: { fontSize: 12, fontWeight: 'bold' }, value: money(data.summary.total), valueStyle: { fontSize: 12, fontWeight: 'bold' } }
			]} /></View>
		</Section>
		<PageFooter leftText={data.notes} rightText={pageNumber} sticky pagePadding={25} />
	</Page>
</Document>
