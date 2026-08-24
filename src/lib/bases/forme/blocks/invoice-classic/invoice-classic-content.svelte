<script lang="ts">
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
		<PageFooter leftText={data.notes} rightText="Page 1 of 1" sticky pagePadding={25} />
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
					<TableCell text="Description" /><TableCell align="center" text="QTY" />
					<TableCell align="center" text="Rate" /><TableCell align="right" text="Total" _last />
				</TableRow></TableHeader>
				<TableBody>
					{#each data.items as item}
						<TableRow>
							<TableCell text={item.description} /><TableCell align="center" text={`${item.quantity}`} />
							<TableCell align="center" text={`$${item.unitPrice}`} />
							<TableCell align="right" text={`$${(item.quantity * item.unitPrice).toFixed(2)}`} _last />
						</TableRow>
					{/each}
				</TableBody>
			</Table>
			<Section noWrap style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
				<View style={{ width: 220 }}>
					<KeyValue size="sm" dividerThickness={1} divided items={[
						{ key: 'Subtotal', value: `$${data.summary.subtotal.toFixed(2)}` },
						{ key: 'Tax', value: `$${data.summary.tax.toFixed(2)}` },
						{ key: 'Total', keyStyle: { fontSize: 12, fontWeight: 'bold' }, value: `$${data.summary.total.toFixed(2)}`, valueStyle: { fontSize: 12, fontWeight: 'bold' } }
					]} />
				</View>
			</Section>
		</View>
	</Page>
</Document>
