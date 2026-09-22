<script lang="ts">
	import { PAGE_NUMBER, TOTAL_PAGES } from '$lib/bases/forme/lib/pdf-primitives';
	import { invoiceFormatter } from '$lib/utils/invoice-format';
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

	import type { InvoiceMinimalData } from './invoice-minimal.types';

	let { data }: { data: InvoiceMinimalData } = $props();
	const theme = usePdfcnTheme();
	const money = $derived(invoiceFormatter(data));
	const styles = {
		infoLabel: { color: theme.colors.primary, fontSize: 8, fontWeight: 'bold', letterSpacing: 0.8, marginBottom: 4, textTransform: 'uppercase' },
		infoRow: { flexDirection: 'row', marginBottom: 28 },
		invoiceStamp: { alignSelf: 'flex-start', borderColor: theme.colors.primary, borderRadius: theme.primitives.borderRadius.sm, borderStyle: 'solid', borderWidth: 2, paddingHorizontal: 12, paddingVertical: 8 },
		page: { backgroundColor: theme.colors.background }
	};
</script>

<Document title={`Invoice ${data.invoiceNumber}`}>
	<Page size="A4" margin={{ bottom: 25, left: 56, right: 56, top: 56 }}>
		<PageFooter leftText={data.notes} rightText={`Page ${PAGE_NUMBER} of ${TOTAL_PAGES}`} sticky pagePadding={25} />
		<View style={styles.page}>
			<Section noWrap style={{ alignItems: 'flex-start', flexDirection: 'row', marginBottom: theme.spacing.sectionGap }}>
				<View style={{ flex: 1 }}><PageHeader variant="minimal" title={data.companyName}
					subtitle={`${data.companyAddress}  ·  ${data.companyEmail}`} marginBottom={0} /></View>
				<View style={styles.invoiceStamp}>
					<Text style={{ color: theme.colors.primary, fontSize: 7, fontWeight: 'bold', textAlign: 'right' }} noMargin transform="uppercase">Invoice</Text>
					<Text style={{ color: theme.colors.foreground, fontSize: 14, fontWeight: 'bold', textAlign: 'right' }} noMargin>{data.invoiceNumber}</Text>
					<Text style={{ color: theme.colors.mutedForeground, fontSize: 8, textAlign: 'right' }} noMargin>{data.invoiceDate}</Text>
				</View>
			</Section>
			<View style={styles.infoRow}>
				<View style={{ paddingRight: 20, width: 251 }}>
					<Text style={styles.infoLabel} noMargin>Bill To</Text>
					<Text variant="sm" noMargin>{data.billTo.name}</Text>
					<Text variant="xs" noMargin color="mutedForeground">{data.billTo.address}</Text>
					<Text variant="xs" noMargin color="mutedForeground">{data.billTo.email}</Text>
					<Text variant="xs" noMargin color="mutedForeground">{data.billTo.phone}</Text>
				</View>
				<View style={{ width: 232 }}>
					<Text style={styles.infoLabel} noMargin>Invoice Details</Text>
					<KeyValue size="sm" items={[
						{ key: 'Due Date', value: data.dueDate }, { key: 'Payment', value: data.paymentTerms.method },
						{ key: 'GST', value: data.paymentTerms.gst }
					]} />
				</View>
			</View>
			<Table variant="compact">
				<TableHeader><TableRow header>
					<TableCell style={{ flex: 48 }} text="Description" /><TableCell style={{ flex: 12 }} align="center" text="Qty" />
					<TableCell style={{ flex: 20 }} align="right" text="Rate" /><TableCell style={{ flex: 20 }} align="right" text="Total" />
				</TableRow></TableHeader>
				<TableBody>{#each data.items as item}
					<TableRow>
						<TableCell style={{ flex: 48 }} text={item.description} /><TableCell style={{ flex: 12 }} align="center" text={`${item.quantity}`} />
						<TableCell style={{ flex: 20 }} align="right" text={money(item.unitPrice)} />
						<TableCell style={{ flex: 20 }} align="right" text={money((item.quantity * item.unitPrice))} />
					</TableRow>
				{/each}</TableBody>
			</Table>
			<Section noWrap style={{ flexDirection: 'row', marginTop: 20 }}>
				<View style={{ flex: 1 }} />
				<View style={{ width: 240 }}><KeyValue size="sm" dividerThickness={1} divided items={[
					{ key: 'Subtotal', value: money(data.summary.subtotal) },
					{ key: data.taxLabel ?? 'Tax', value: money(data.summary.tax) },
					{ key: 'Balance Due', keyStyle: { fontSize: 12, fontWeight: 'bold' }, value: money(data.summary.total), valueStyle: { color: theme.colors.primary, fontSize: 13, fontWeight: 'bold' } }
				]} /></View>
			</Section>
		</View>
	</Page>
</Document>
