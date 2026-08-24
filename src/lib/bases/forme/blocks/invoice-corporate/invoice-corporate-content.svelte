<script lang="ts">
	import Document from '$lib/bases/forme/lib/Document.svelte';
	import Page from '$lib/bases/forme/lib/Page.svelte';
	import View from '$lib/bases/forme/lib/View.svelte';
	import KeyValue from '$lib/bases/forme/components/key-value/key-value.svelte';
	import PageFooter from '$lib/bases/forme/components/page-footer/page-footer.svelte';
	import PageHeader from '$lib/bases/forme/components/page-header/page-header.svelte';
	import PdfImage from '$lib/bases/forme/components/pdf-image/pdf-image.svelte';
	import Table from '$lib/bases/forme/components/table/table.svelte';
	import TableBody from '$lib/bases/forme/components/table/table-body.svelte';
	import TableCell from '$lib/bases/forme/components/table/table-cell.svelte';
	import TableHeader from '$lib/bases/forme/components/table/table-header.svelte';
	import TableRow from '$lib/bases/forme/components/table/table-row.svelte';
	import Text from '$lib/bases/forme/components/text/text.svelte';
	import { usePdfcnTheme } from '$lib/theme-provider.svelte';

	import type { InvoiceCorporateData } from './invoice-corporate.types';

	let { data }: { data: InvoiceCorporateData } = $props();
	const theme = usePdfcnTheme();
	const styles = {
		infoColumn: { flex: 1 },
		infoGrid: { flexDirection: 'row', gap: 24, marginBottom: theme.spacing.sectionGap },
		infoLabel: { color: theme.colors.mutedForeground, fontSize: 9, fontWeight: 'bold', letterSpacing: 0.6, marginBottom: 6, textTransform: 'uppercase' },
		page: { backgroundColor: theme.colors.background },
		summaryCard: { backgroundColor: theme.colors.muted, borderRadius: theme.primitives.borderRadius.md, marginTop: 20, padding: 16 },
		summaryRow: { flexDirection: 'row', justifyContent: 'flex-end' }
	};
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

<Document title={`Invoice ${data.invoiceNumber}`}>
	<Page size="A4" margin={{ bottom: 25, left: 56, right: 56, top: 56 }}>
		<PageFooter leftText={data.notes} rightText="Page 1 of 1" sticky pagePadding={25} />
		<View style={styles.page}>
			<PageHeader variant="logo-right" {logo} title={data.companyName}
				subtitle={`${data.subtitle}  ·  ${data.companyAddress}`} style={{ marginBottom: theme.spacing.sectionGap }} />
			<View style={styles.infoGrid}>
				<View style={styles.infoColumn}>
					<Text style={styles.infoLabel} noMargin>Invoice Details</Text>
					<KeyValue size="sm" items={[
						{ key: 'Invoice #', value: data.invoiceNumber }, { key: 'Issue Date', value: data.invoiceDate },
						{ key: 'Due Date', value: data.dueDate }, { key: 'Payment', value: data.paymentTerms.method }
					]} />
				</View>
				<View style={styles.infoColumn}>
					<Text style={styles.infoLabel} noMargin>Bill To</Text>
					<Text variant="sm" weight="semibold" noMargin>{data.billTo.name}</Text>
					<Text variant="xs" noMargin color="mutedForeground">{data.billTo.address}</Text>
					<Text variant="xs" noMargin color="mutedForeground">{data.billTo.email}</Text>
					<Text variant="xs" noMargin color="mutedForeground">{data.billTo.phone}</Text>
				</View>
			</View>
			<Table variant="bordered">
				<TableHeader><TableRow header>
					<TableCell text="Description" /><TableCell align="center" text="Qty" />
					<TableCell align="right" text="Unit Price" /><TableCell align="right" text="Amount" _last />
				</TableRow></TableHeader>
				<TableBody>{#each data.items as item}
					<TableRow>
						<TableCell text={item.description} /><TableCell align="center" text={`${item.quantity}`} />
						<TableCell align="right" text={`$${item.unitPrice.toLocaleString()}`} />
						<TableCell align="right" text={`$${(item.quantity * item.unitPrice).toLocaleString()}`} _last />
					</TableRow>
				{/each}</TableBody>
			</Table>
			<View style={styles.summaryCard}>
				<View style={styles.summaryRow}><View style={{ width: 260 }}>
					<KeyValue size="md" dividerThickness={1} dividerColor="border" divided items={[
						{ key: 'Subtotal', value: `$${data.summary.subtotal.toLocaleString()}` },
						{ key: 'Tax (8%)', value: `$${data.summary.tax.toFixed(2)}` },
						{ key: 'Total Due', keyStyle: { fontSize: 13, fontWeight: 'bold' }, value: `$${data.summary.total.toFixed(2)}`, valueStyle: { color: theme.colors.primary, fontSize: 14, fontWeight: 'bold' } }
					]} />
				</View></View>
			</View>
		</View>
	</Page>
</Document>
