<script lang="ts">
	import Badge from '$lib/bases/forme/components/badge/badge.svelte';
	import DataTable from '$lib/bases/forme/components/data-table/data-table.svelte';
	import PdfGraph from '$lib/bases/forme/components/graph/graph.svelte';
	import KeyValue from '$lib/bases/forme/components/key-value/key-value.svelte';
	import PdfList from '$lib/bases/forme/components/list/list.svelte';
	import PageFooter from '$lib/bases/forme/components/page-footer/page-footer.svelte';
	import PageHeader from '$lib/bases/forme/components/page-header/page-header.svelte';
	import Section from '$lib/bases/forme/components/section/section.svelte';
	import Text from '$lib/bases/forme/components/text/text.svelte';
	import Document from '$lib/bases/forme/lib/Document.svelte';
	import Page from '$lib/bases/forme/lib/Page.svelte';
	import View from '$lib/bases/forme/lib/View.svelte';
	import { usePdfcnTheme } from '$lib/theme-provider.svelte';
	import type { GraphLegendPosition, GraphVariant } from '$lib/bases/forme/components/graph/graph.types';

	import type { BaseReportData, ReportTone } from './report.types';

	interface Props {
		data: BaseReportData;
		titlePrefix: string;
		statusLabel: string;
		statusTone: ReportTone;
		graphVariant: GraphVariant;
		graphTitle: string;
		graphSubtitle: string;
		graphLegend?: GraphLegendPosition;
		graphShowValues?: boolean;
		graphColors?: string[];
		graphData?: { label: string; value: number }[];
	}

	let {
		data, titlePrefix, statusLabel, statusTone, graphVariant, graphTitle, graphSubtitle,
		graphLegend = 'none', graphShowValues = false, graphColors, graphData
	}: Props = $props();

	const theme = usePdfcnTheme();
	const toneColor = (tone: ReportTone) => tone === 'success' ? theme.colors.success
		: tone === 'warning' ? theme.colors.warning
		: tone === 'destructive' ? theme.colors.destructive : theme.colors.info;
	const accent = $derived(toneColor(statusTone));
	const graphHeight: Record<GraphVariant, number> = { area: 191, bar: 181, donut: 191, 'horizontal-bar': 148, line: 191, pie: 191 };
	const deliveryOffset: Record<GraphVariant, number> = { area: 0, bar: 59, donut: -3, 'horizontal-bar': -4, line: -30, pie: 0 };
	const sectionOffset: Record<GraphVariant, number> = { area: 0, bar: 32, donut: 0, 'horizontal-bar': 0, line: 0, pie: 0 };
	const titleOffset: Record<GraphVariant, number> = { area: 0, bar: 0, donut: 0, 'horizontal-bar': 0, line: 0, pie: 0 };
	const styles = {
		col: { width: 225 },
		graphShell: { backgroundColor: theme.colors.background, borderColor: theme.colors.border, borderRadius: theme.primitives.borderRadius.md, borderStyle: 'solid', borderWidth: 1, padding: 12 },
		metricCard: { alignItems: 'flex-start', backgroundColor: theme.colors.background, borderColor: theme.colors.border, borderRadius: theme.primitives.borderRadius.md, borderStyle: 'solid', borderWidth: 1, height: 75, padding: 8, width: 225 },
		metricLabel: { color: theme.colors.mutedForeground, fontSize: 8, letterSpacing: 0.5, marginBottom: 2, textTransform: 'uppercase' },
		metricValue: { color: theme.colors.foreground, fontSize: 14, fontWeight: theme.primitives.fontWeights.bold, marginBottom: 2 },
		metricsGrid: { flexDirection: 'column', gap: 8 },
		metricsRow: { flexDirection: 'row', gap: 8 },
		page: { backgroundColor: theme.colors.background },
		toolbar: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, width: 499 },
		twoColumn: { alignItems: 'flex-start', flexDirection: 'row', gap: 10 }
	};
	const averageProgress = $derived(Math.round(data.rows.reduce((sum, row) => sum + row.progress, 0) / Math.max(data.rows.length, 1)));
</script>

{#snippet progressCell(value: unknown)}<Text noMargin>{String(value)}%</Text>{/snippet}

<Document title={`${titlePrefix} ${data.period}`}>
	<Page size="A4" margin={{ bottom: 48, left: 48, right: 48, top: 56 }}>
		<PageFooter variant="three-column" leftText="Confidential — Internal Use" centerText="Generated with pdfcn" rightText="Page 1 of 1" sticky pagePadding={theme.spacing.page.marginLeft} />
		<View style={styles.page}>
			<PageHeader variant="two-column" title={data.title} subtitle={`${titlePrefix} · ${data.subtitle}`} rightText={data.period} rightSubText={`Generated ${data.generatedAt}`} marginBottom={14} />
			<View style={styles.toolbar}>
				<Badge label={statusLabel} variant={statusTone} size="sm" />
				<Text variant="xs" color="mutedForeground" noMargin>Author: {data.author}</Text>
			</View>
			<Section variant="card" padding="md" noWrap>
				<Text variant="sm" transform="uppercase" color="mutedForeground">Executive Summary</Text>
				<View style={styles.metricsGrid}>
					{#each [0, 2] as startIndex}
						<View style={styles.metricsRow}>
							{#each data.summary.slice(startIndex, startIndex + 2) as metric (metric.label)}
								<View style={{ ...styles.metricCard, borderLeftColor: metric.tone ? toneColor(metric.tone) : accent, borderLeftWidth: 3 }}>
									<Text style={styles.metricLabel} noMargin>{metric.label}</Text>
									<Text style={styles.metricValue} noMargin>{metric.value}</Text>
									{#if metric.trend}<Badge label={metric.trend} size="sm" variant={metric.tone ?? 'info'} style={{ height: 16, width: metric.trend.endsWith('QoQ') ? metric.trend.length * 6.5 + 10 : metric.trend.length * 5 + 18 }} />{/if}
								</View>
							{/each}
						</View>
					{/each}
				</View>
			</Section>
		</View>
	</Page>

	<Page size="A4" margin={{ bottom: 48, left: 48, right: 48, top: 56 }}>
		<PageFooter variant="three-column" leftText="Confidential — Internal Use" centerText="Generated with pdfcn" rightText="Page 1 of 1" sticky pagePadding={theme.spacing.page.marginLeft} />
		<View style={styles.page}>
			<Section padding="md" noWrap style={{ position: 'relative', top: sectionOffset[graphVariant] }}>
				<Text variant="sm" transform="uppercase" color="mutedForeground" style={{ position: 'relative', top: titleOffset[graphVariant] }}>Performance Trend</Text>
				<View style={{ ...styles.graphShell, paddingBottom: graphVariant === 'horizontal-bar' ? 56 : 12 }}>
					<PdfGraph variant={graphVariant} data={graphData ?? data.series} title={graphTitle} subtitle={graphSubtitle} showGrid={graphVariant !== 'pie' && graphVariant !== 'donut'} showValues={graphShowValues} smooth={graphVariant === 'line' || graphVariant === 'area'} legend={graphLegend} height={graphHeight[graphVariant]} colors={graphColors} fullWidth containerPadding={12} wrapperPadding={12} style={{ marginBottom: 0 }} />
				</View>
			</Section>
			<Section padding="md" style={{ position: 'relative', top: deliveryOffset[graphVariant] }}>
				<Text variant="sm" transform="uppercase" color="mutedForeground">Delivery Table</Text>
				<DataTable variant="compact" size="compact" stripe columns={[
					{ header: 'Stream', key: 'label' }, { header: 'Owner', key: 'owner' },
					{ align: 'center', header: 'Status', key: 'status' },
					{ align: 'right', header: 'Progress', key: 'progress', render: progressCell },
					{ align: 'right', header: 'Risk', key: 'risk' }
				]} data={data.rows} footer={{ label: 'Totals', owner: '-', progress: averageProgress, risk: '-', status: '-' }} />
			</Section>
		</View>
	</Page>

	<Page size="A4" margin={{ bottom: 48, left: 48, right: 48, top: 56 }}>
		<PageFooter variant="three-column" leftText="Confidential — Internal Use" centerText="Generated with pdfcn" rightText="Page 1 of 1" sticky pagePadding={theme.spacing.page.marginLeft} />
		<View style={styles.page}>
			<Section padding="md" variant="card" noWrap>
				<Text variant="sm" transform="uppercase" color="mutedForeground">Highlights & Risks</Text>
				<View style={styles.twoColumn}>
					<View style={styles.col}><PdfList variant="checklist" items={data.highlights.map((item) => ({ checked: true, text: item }))} gap="sm" /></View>
					<View style={styles.col}><KeyValue size="sm" divided items={[
						{ key: 'Open Risks', value: `${data.rows.filter((row) => row.risk !== 'Low').length}` },
						{ key: 'On-Track Streams', value: `${data.rows.filter((row) => row.status === 'On Track').length}/${data.rows.length}` },
						{ key: 'Avg Progress', value: `${averageProgress}%` }
					]} /></View>
				</View>
			</Section>
		</View>
	</Page>
</Document>
