<script lang="ts">
	import { PAGE_NUMBER, TOTAL_PAGES } from '$lib/bases/forme/lib/pdf-primitives';
	import { invoiceFormatter } from '$lib/utils/invoice-format';
	import Document from '$lib/bases/forme/lib/Document.svelte';
	import Page from '$lib/bases/forme/lib/Page.svelte';
	import View from '$lib/bases/forme/lib/View.svelte';
	import KeyValue from '$lib/bases/forme/components/key-value/key-value.svelte';
	import PageFooter from '$lib/bases/forme/components/page-footer/page-footer.svelte';
	import PageHeader from '$lib/bases/forme/components/page-header/page-header.svelte';
	import PdfImage from '$lib/bases/forme/components/pdf-image/pdf-image.svelte';
	import Section from '$lib/bases/forme/components/section/section.svelte';
	import Table from '$lib/bases/forme/components/table/table.svelte';
	import TableBody from '$lib/bases/forme/components/table/table-body.svelte';
	import TableCell from '$lib/bases/forme/components/table/table-cell.svelte';
	import TableHeader from '$lib/bases/forme/components/table/table-header.svelte';
	import TableRow from '$lib/bases/forme/components/table/table-row.svelte';
	import Text from '$lib/bases/forme/components/text/text.svelte';
	import { usePdfcnTheme } from '$lib/theme-provider.svelte';

	import type { InvoiceClassicData } from './invoice-classic.types';

	let { data }: { data: InvoiceClassicData } = $props();
	const theme = usePdfcnTheme();
	const money = $derived(invoiceFormatter(data));
	const pageStyle = { backgroundColor: theme.colors.background };
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

<Document title={`Invoice ${data.invoiceNumber}`}>
	<Page size="A4" margin={{ bottom: 25, left: 56, right: 56, top: 56 }}>
		<PageFooter leftText={data.notes} rightText={`Page ${PAGE_NUMBER} of ${TOTAL_PAGES}`} sticky pagePadding={25} />
		<View style={pageStyle}>
			<PageHeader variant="logo-left" {logo} title={data.companyName} subtitle={data.subtitle}
				rightText={data.invoiceNumber} rightSubText={`Due: ${data.dueDate}`} style={{ marginBottom: 0 }} />
			<Section noWrap style={{ flexDirection: 'row' }}>
				<View style={{ flex: 1, paddingRight: 15 }}>
					<Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 2 }} color="mutedForeground" transform="uppercase" noMargin>From</Text>
					<Text noMargin variant="xs">{data.companyName}</Text>
					<Text noMargin variant="xs">{data.companyAddress}</Text>
					<Text noMargin variant="xs">{data.companyEmail}</Text>
				</View>
				<View style={{ flex: 1, paddingRight: 15 }}>
					<Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 2 }} color="mutedForeground" transform="uppercase" noMargin>Bill To</Text>
					<Text noMargin variant="xs">{data.billTo.name}</Text>
					<Text noMargin variant="xs">{data.billTo.address}</Text>
					<Text noMargin variant="xs">{data.billTo.email}</Text>
				</View>
				<View style={{ flex: 1, paddingRight: 15 }}>
					<Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 2 }} color="mutedForeground" transform="uppercase" noMargin>Payment Terms</Text>
					<Text noMargin variant="xs">{data.paymentTerms.method}</Text>
					<Text noMargin variant="xs">{data.paymentTerms.gst}</Text>
					<Text noMargin variant="xs">{data.paymentTerms.dueDate}</Text>
				</View>
			</Section>
			<Table variant="grid" zebraStripe>
				<TableHeader><TableRow header>
					<TableCell style={{ flex: 48 }} text="Description" /><TableCell style={{ flex: 12 }} align="center" text="QTY" />
					<TableCell style={{ flex: 20 }} align="right" text="Rate" /><TableCell style={{ flex: 20 }} align="right" text="Total" _last />
				</TableRow></TableHeader>
				<TableBody>
					{#each data.items as item}
						<TableRow>
							<TableCell style={{ flex: 48 }} text={item.description} /><TableCell style={{ flex: 12 }} align="center" text={`${item.quantity}`} />
							<TableCell style={{ flex: 20 }} align="right" text={money(item.unitPrice)} />
							<TableCell style={{ flex: 20 }} align="right" text={money((item.quantity * item.unitPrice))} _last />
						</TableRow>
					{/each}
				</TableBody>
			</Table>
			<Section noWrap style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
				<View style={{ width: 220 }}>
					<KeyValue size="sm" dividerThickness={1} divided items={[
						{ key: 'Subtotal', value: money(data.summary.subtotal) },
						{ key: data.taxLabel ?? 'Tax', value: money(data.summary.tax) },
						{ key: 'Total', keyStyle: { fontSize: 12, fontWeight: 'bold' }, value: money(data.summary.total), valueStyle: { fontSize: 12, fontWeight: 'bold' } }
					]} />
				</View>
			</Section>
		</View>
	</Page>
</Document>
