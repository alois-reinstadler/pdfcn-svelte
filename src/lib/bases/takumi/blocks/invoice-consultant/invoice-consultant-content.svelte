<script lang="ts">
	import KeyValue from '$lib/bases/takumi/components/key-value/key-value.svelte';
	import PageFooter from '$lib/bases/takumi/components/page-footer/page-footer.svelte';
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

	import type { InvoiceConsultantData } from './invoice-consultant.types';

	let { data }: { data: InvoiceConsultantData } = $props();
	const theme = usePdfcnTheme();
	const pageStyle = { backgroundColor: theme.colors.background, boxSizing: 'border-box', minHeight: 841,
		padding: theme.spacing.page.marginTop, paddingBottom: theme.spacing.page.marginBottom, position: 'relative' };
	const partyLabelStyle = { borderBottomColor: theme.colors.border, borderBottomStyle: 'solid', borderBottomWidth: 1,
		color: theme.colors.primary, fontSize: 9, fontWeight: 'bold', letterSpacing: 0.6, marginBottom: 6, paddingBottom: 4, textTransform: 'uppercase' };
</script>

<Document title={`Invoice ${data.invoiceNumber}`}>
	<Page size="A4" style={pageStyle}>
		<View style={{ alignItems: 'flex-start', borderBottomColor: theme.colors.primary, borderBottomStyle: 'solid', borderBottomWidth: 2, flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.sectionGap, paddingBottom: theme.spacing.componentGap }}>
			<View style={{ flex: 1 }}><Text variant="xl" weight="bold" noMargin>{data.companyName}</Text><Text variant="sm" color="mutedForeground" noMargin>{data.subtitle}</Text><Text variant="xs" color="mutedForeground" noMargin>{data.companyAddress}</Text></View>
			<View style={{ alignItems: 'flex-end' }}><Text variant="xs" color="mutedForeground" transform="uppercase" noMargin>Invoice</Text><Text variant="lg" weight="bold" noMargin>{data.invoiceNumber}</Text><Text variant="xs" color="mutedForeground" noMargin>{data.invoiceDate}</Text><Text variant="xs" color="mutedForeground" noMargin>Due: {data.dueDate}</Text></View>
		</View>
		{#if data.projectRef}<View style={{ alignItems: 'center', backgroundColor: theme.colors.muted, borderRadius: theme.primitives.borderRadius.sm, flexDirection: 'row', gap: 8, marginBottom: theme.spacing.sectionGap, paddingHorizontal: 10, paddingVertical: 6 }}>
			<Text variant="xs" weight="semibold" color="mutedForeground" noMargin>Project Reference:</Text><Text variant="xs" weight="bold" noMargin>{data.projectRef}</Text>
		</View>{/if}
		<View style={{ flexDirection: 'row', gap: 40, marginBottom: theme.spacing.sectionGap }}>
			<View style={{ flex: 1 }}><Text style={partyLabelStyle} noMargin>From (Consultant)</Text><Text variant="sm" weight="semibold" noMargin>{data.consultant.name}</Text><Text variant="xs" noMargin color="mutedForeground">{data.consultant.title}</Text><Text variant="xs" noMargin color="mutedForeground">{data.consultant.email}</Text></View>
			<View style={{ flex: 1 }}><Text style={partyLabelStyle} noMargin>Bill To (Client)</Text><Text variant="sm" weight="semibold" noMargin>{data.client.name}</Text><Text variant="xs" noMargin color="mutedForeground">{data.client.company}</Text><Text variant="xs" noMargin color="mutedForeground">{data.client.address}</Text><Text variant="xs" noMargin color="mutedForeground">{data.client.email}</Text></View>
		</View>
		<Table variant="line"><TableHeader><TableRow header><TableCell text="Service Description" /><TableCell align="center" text="Hours" /><TableCell align="right" text="Rate ($/hr)" /><TableCell align="right" text="Amount" /></TableRow></TableHeader>
			<TableBody>{#each data.services as service}<TableRow><TableCell text={service.description} /><TableCell align="center" text={`${service.hours}`} /><TableCell align="right" text={`$${service.rate}`} /><TableCell align="right" text={`$${(service.hours * service.rate).toLocaleString()}`} /></TableRow>{/each}</TableBody>
		</Table>
		<Section noWrap style={{ flexDirection: 'row', marginTop: 20 }}>
			<View style={{ flex: 1, paddingRight: 24 }}><View style={{ alignSelf: 'flex-start', backgroundColor: theme.colors.primary, borderRadius: theme.primitives.borderRadius.sm, paddingHorizontal: 12, paddingVertical: 8 }}><Text style={{ color: theme.colors.primaryForeground, fontSize: 9, fontWeight: 'bold' }} noMargin>Total Hours: {data.summary.totalHours}</Text></View><Text variant="xs" color="mutedForeground" style={{ marginTop: 8 }}>Payment: {data.paymentTerms.method}</Text></View>
			<View style={{ width: 250 }}><KeyValue size="sm" dividerThickness={1} divided items={[
				{ key: 'Subtotal', value: `$${data.summary.subtotal.toLocaleString()}` }, { key: 'Tax (5%)', value: `$${data.summary.tax.toFixed(2)}` },
				{ key: 'Amount Due', keyStyle: { fontSize: 13, fontWeight: 'bold' }, value: `$${data.summary.total.toFixed(2)}`, valueStyle: { color: theme.colors.primary, fontSize: 14, fontWeight: 'bold' } }
			]} /></View>
		</Section>
		{#if data.notes}<View style={{ backgroundColor: theme.colors.muted, borderLeftColor: theme.colors.info, borderLeftStyle: 'solid', borderLeftWidth: 3, marginTop: 16, paddingLeft: 12, paddingVertical: 8 }}><Text variant="xs" color="mutedForeground">{data.notes}</Text></View>{/if}
		<PageFooter leftText="Professional services invoice – Please retain for records" rightText="Page 1 of 1" sticky pagePadding={25} />
	</Page>
</Document>
