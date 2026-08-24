<script lang="ts">
	import Document from '$lib/bases/forme/lib/Document.svelte';
	import Page from '$lib/bases/forme/lib/Page.svelte';
	import View from '$lib/bases/forme/lib/View.svelte';
	import KeyValue from '$lib/bases/forme/components/key-value/key-value.svelte';
	import PageFooter from '$lib/bases/forme/components/page-footer/page-footer.svelte';
	import PageHeader from '$lib/bases/forme/components/page-header/page-header.svelte';
	import Section from '$lib/bases/forme/components/section/section.svelte';
	import Table from '$lib/bases/forme/components/table/table.svelte';
	import TableBody from '$lib/bases/forme/components/table/table-body.svelte';
	import TableCell from '$lib/bases/forme/components/table/table-cell.svelte';
	import TableHeader from '$lib/bases/forme/components/table/table-header.svelte';
	import TableRow from '$lib/bases/forme/components/table/table-row.svelte';
	import Text from '$lib/bases/forme/components/text/text.svelte';
	import { usePdfcnTheme } from '$lib/theme-provider.svelte';

	import type { InvoiceCreativeData } from './invoice-creative.types';

	let { data }: { data: InvoiceCreativeData } = $props();
	const theme = usePdfcnTheme();
	const styles = {
		accentBlock: { backgroundColor: theme.colors.muted, borderLeftColor: theme.colors.accent, borderLeftStyle: 'solid', borderLeftWidth: 4, marginBottom: theme.spacing.sectionGap, paddingLeft: 14, paddingVertical: 10 },
		badgeLabel: { color: theme.colors.primaryForeground, fontSize: 8, fontWeight: 'bold', letterSpacing: 1.2, marginBottom: 2, textTransform: 'uppercase' },
		badgeNumber: { color: theme.colors.primaryForeground, fontSize: 16, fontWeight: 'bold' },
		heroSection: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.sectionGap },
		infoColumn: { flex: 1 }, infoGrid: { flexDirection: 'row', gap: 32 },
		invoiceBadge: { alignItems: 'center', backgroundColor: theme.colors.primary, borderRadius: theme.primitives.borderRadius.md, paddingHorizontal: 20, paddingVertical: 14 },
		page: { backgroundColor: theme.colors.background },
		sectionLabel: { color: theme.colors.accent, fontSize: 8, fontWeight: 'bold', letterSpacing: 0.8, marginBottom: 6, textTransform: 'uppercase' },
		summaryLeft: { flex: 1, paddingRight: 20 },
		summaryRight: { backgroundColor: theme.colors.muted, borderRadius: theme.primitives.borderRadius.sm, padding: 14, width: 240 },
		summarySection: { flexDirection: 'row', marginTop: 24 }
	};
</script>

<Document title={`Invoice ${data.invoiceNumber}`}>
	<Page size="A4" margin={{ bottom: 25, left: 56, right: 56, top: 56 }}>
		<PageFooter variant="centered" leftText="Thank you for choosing us for your creative needs!" sticky pagePadding={25} />
		<View style={styles.page}>
			<View style={styles.heroSection}>
				<View style={{ flex: 1 }}><PageHeader variant="centered" title={data.companyName} subtitle={`${data.subtitle}  ·  ${data.companyAddress}`} marginBottom={0} /></View>
				<View style={styles.invoiceBadge}><Text style={styles.badgeLabel} noMargin>Invoice</Text><Text style={styles.badgeNumber} noMargin>{data.invoiceNumber}</Text></View>
			</View>
			<View style={styles.accentBlock}><View style={styles.infoGrid}>
				<View style={styles.infoColumn}>
					<Text style={styles.sectionLabel} noMargin>Billed To</Text>
					<Text variant="sm" weight="semibold" noMargin>{data.billTo.name}</Text>
					<Text variant="xs" noMargin color="mutedForeground">{data.billTo.address}</Text>
					<Text variant="xs" noMargin color="mutedForeground">{data.billTo.email} · {data.billTo.phone}</Text>
				</View>
				<View style={styles.infoColumn}>
					<Text style={styles.sectionLabel} noMargin>Invoice Info</Text>
					<KeyValue size="sm" items={[
						{ key: 'Issue Date', value: data.invoiceDate }, { key: 'Due Date', value: data.dueDate },
						{ key: 'Payment', value: data.paymentTerms.method }
					]} />
				</View>
			</View></View>
			<Table variant="striped" zebraStripe>
				<TableHeader><TableRow header>
					<TableCell text="Deliverable" /><TableCell align="center" text="Qty" />
					<TableCell align="right" text="Rate" /><TableCell align="right" text="Amount" />
				</TableRow></TableHeader>
				<TableBody>{#each data.items as item}
					<TableRow>
						<TableCell text={item.description} /><TableCell align="center" text={`${item.quantity}`} />
						<TableCell align="right" text={`$${item.unitPrice.toLocaleString()}`} />
						<TableCell align="right" text={`$${(item.quantity * item.unitPrice).toLocaleString()}`} />
					</TableRow>
				{/each}</TableBody>
			</Table>
			<Section noWrap style={styles.summarySection}>
				<View style={styles.summaryLeft}>
					<Text style={styles.sectionLabel} noMargin>Notes & Terms</Text>
					<Text variant="xs" color="mutedForeground">{data.notes}</Text>
					<Text variant="xs" color="mutedForeground" style={{ marginTop: 4 }}>GST: {data.paymentTerms.gst}</Text>
				</View>
				<View style={styles.summaryRight}>
					<KeyValue size="sm" dividerThickness={1} divided items={[
						{ key: 'Subtotal', value: `$${data.summary.subtotal.toLocaleString()}` },
						{ key: 'Tax (6.5%)', value: `$${data.summary.tax.toFixed(2)}` },
						{ key: 'Total', keyStyle: { fontSize: 13, fontWeight: 'bold' }, value: `$${data.summary.total.toFixed(2)}`, valueStyle: { color: theme.colors.accent, fontSize: 14, fontWeight: 'bold' } }
					]} />
				</View>
			</Section>
		</View>
	</Page>
</Document>
