<script lang="ts">
	import Badge from '$lib/bases/takumi/components/badge/badge.svelte';
	import DataTable from '$lib/bases/takumi/components/data-table/data-table.svelte';
	import type { GraphLegendPosition, GraphVariant } from '$lib/bases/takumi/components/graph/graph.types';
	import PdfGraph from '$lib/bases/takumi/components/graph/graph.svelte';
	import KeyValue from '$lib/bases/takumi/components/key-value/key-value.svelte';
	import PdfList from '$lib/bases/takumi/components/list/list.svelte';
	import PageFooter from '$lib/bases/takumi/components/page-footer/page-footer.svelte';
	import PageHeader from '$lib/bases/takumi/components/page-header/page-header.svelte';
	import PageNumber from '$lib/bases/takumi/components/page-number/page-number.svelte';
	import Section from '$lib/bases/takumi/components/section/section.svelte';
	import Text from '$lib/bases/takumi/components/text/text.svelte';
	import Document from '$lib/bases/takumi/lib/Document.svelte';
	import Page from '$lib/bases/takumi/lib/Page.svelte';
	import View from '$lib/bases/takumi/lib/View.svelte';
	import { usePdfcnTheme } from '$lib/theme-provider.svelte';

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
		data,
		titlePrefix,
		statusLabel,
		statusTone,
		graphVariant,
		graphTitle,
		graphSubtitle,
		graphLegend = 'none',
		graphShowValues = false,
		graphColors,
		graphData
	}: Props = $props();

	const theme = usePdfcnTheme();
	const toneColor = (tone: ReportTone) =>
		tone === 'success'
			? theme.colors.success
			: tone === 'warning'
				? theme.colors.warning
				: tone === 'destructive'
					? theme.colors.destructive
					: theme.colors.info;
	const accent = $derived(toneColor(statusTone));
	const deliveryOffset: Record<GraphVariant, number> = {
		area: 0,
		bar: 31,
		donut: 65,
		'horizontal-bar': -2,
		line: -31,
		pie: 0
	};
	const graphHeight: Record<GraphVariant, number> = {
		area: 191,
		bar: 184,
		donut: 193,
		'horizontal-bar': 163,
		line: 195,
		pie: 191
	};
	const graphOffset: Record<GraphVariant, number> = {
		area: 0,
		bar: 0,
		donut: 0,
		'horizontal-bar': 0,
		line: 0,
		pie: 0
	};
	const styles = {
		col: { flex: 1 },
		graphShell: {
			backgroundColor: theme.colors.background,
			borderColor: theme.colors.border,
			borderRadius: theme.primitives.borderRadius.md,
			borderStyle: 'solid',
			borderWidth: 1,
			padding: 12
		},
		metricCard: {
			backgroundColor: theme.colors.background,
			borderColor: theme.colors.border,
			borderRadius: theme.primitives.borderRadius.md,
			borderStyle: 'solid',
			borderWidth: 1,
			padding: 8,
			width: '48.6%'
		},
		metricLabel: {
			color: theme.colors.mutedForeground,
			fontSize: 8,
			letterSpacing: 0.5,
			marginBottom: 2,
			textTransform: 'uppercase'
		},
		metricValue: {
			color: theme.colors.foreground,
			fontSize: 14,
			fontWeight: theme.primitives.fontWeights.bold,
			marginBottom: 2
		},
		metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
		page: {
			backgroundColor: theme.colors.background,
			boxSizing: 'border-box',
			minHeight: 841,
			paddingBottom: theme.spacing.page.marginBottom,
			paddingLeft: theme.spacing.page.marginLeft,
			paddingRight: theme.spacing.page.marginRight,
			paddingTop: theme.spacing.page.marginTop,
			position: 'relative'
		},
		pageBreak: { breakAfter: 'page' },
		toolbar: {
			alignItems: 'center',
			flexDirection: 'row',
			justifyContent: 'space-between',
			marginBottom: 8
		},
		twoColumn: { alignItems: 'flex-start', flexDirection: 'row', gap: 10 }
	};
	const averageProgress = $derived(
		Math.round(
			data.rows.reduce((sum, row) => sum + row.progress, 0) / Math.max(data.rows.length, 1)
		)
	);
</script>

{#snippet progressCell(value: unknown)}<Text noMargin>{String(value)}%</Text>{/snippet}
{#snippet pageNumber()}<PageNumber size="xs" />{/snippet}

<Document title={`${titlePrefix} ${data.period}`}>
	<Page size="A4" style={[styles.page, styles.pageBreak]}>
		<PageHeader
			variant="two-column"
			title={data.title}
			subtitle={`${titlePrefix} · ${data.subtitle}`}
			rightText={data.period}
			rightSubText={`Generated ${data.generatedAt}`}
			marginBottom={14}
		/>

		<View style={styles.toolbar}>
			<Badge label={statusLabel} variant={statusTone} size="sm" />
			<Text variant="xs" color="mutedForeground" noMargin>Author: {data.author}</Text>
		</View>

		<Section variant="card" padding="md" noWrap>
			<Text variant="sm" transform="uppercase" color="mutedForeground">Executive Summary</Text>
			<View style={styles.metricsGrid}>
				{#each data.summary as metric (metric.label)}
					<View
						style={{
							...styles.metricCard,
							borderLeftColor: metric.tone ? toneColor(metric.tone) : accent,
							borderLeftWidth: 3
						}}
					>
						<Text style={styles.metricLabel} noMargin>{metric.label}</Text>
						<Text style={styles.metricValue} noMargin>{metric.value}</Text>
						{#if metric.trend}
							<Badge label={metric.trend} size="sm" variant={metric.tone ?? 'info'} />
						{/if}
					</View>
				{/each}
			</View>
		</Section>

		<PageFooter
			variant="three-column"
			leftText="Confidential — Internal Use"
			centerText="Generated with pdfcn"
			rightText={pageNumber}
			sticky
			pagePadding={theme.spacing.page.marginLeft}
		/>
	</Page>

	<Page size="A4" style={[styles.page, styles.pageBreak]}>
		<Section
			padding="md"
			noWrap
			style={graphVariant === 'horizontal-bar' ? { marginTop: -6 } : undefined}
		>
			<Text variant="sm" transform="uppercase" color="mutedForeground">Performance Trend</Text>
			<View
				style={{
					...styles.graphShell,
					marginTop: graphVariant === 'horizontal-bar' ? 34 : 0,
					position: 'relative',
					top: graphOffset[graphVariant]
				}}
			>
				<PdfGraph
					variant={graphVariant}
					data={graphData ?? data.series}
					title={graphTitle}
					subtitle={graphSubtitle}
					showGrid={graphVariant !== 'pie' && graphVariant !== 'donut'}
					showValues={graphShowValues}
					smooth={graphVariant === 'line' || graphVariant === 'area'}
					legend={graphLegend}
					height={graphHeight[graphVariant]}
					colors={graphColors}
					fullWidth
					containerPadding={12}
					wrapperPadding={12}
					style={{ marginBottom: 0 }}
				/>
			</View>
		</Section>

		<Section padding="md" style={{ position: 'relative', top: deliveryOffset[graphVariant] }}>
			<Text variant="sm" transform="uppercase" color="mutedForeground">Delivery Table</Text>
			<DataTable
				variant="compact"
				size="compact"
				stripe
				columns={[
					{ header: 'Stream', key: 'label' },
					{ header: 'Owner', key: 'owner' },
					{ align: 'center', header: 'Status', key: 'status' },
					{ align: 'right', header: 'Progress', key: 'progress', render: progressCell },
					{ align: 'right', header: 'Risk', key: 'risk' }
				]}
				data={data.rows}
				footer={{
					label: 'Totals',
					owner: '-',
					progress: averageProgress,
					risk: '-',
					status: '-'
				}}
			/>
		</Section>

		<PageFooter
			variant="three-column"
			leftText="Confidential — Internal Use"
			centerText="Generated with pdfcn"
			rightText={pageNumber}
			sticky
			pagePadding={theme.spacing.page.marginLeft}
		/>
	</Page>

	<Page size="A4" style={styles.page}>
		<Section padding="md" variant="card" noWrap>
			<Text variant="sm" transform="uppercase" color="mutedForeground">Highlights & Risks</Text>
			<View style={styles.twoColumn}>
				<View style={styles.col}>
					<PdfList
						variant="checklist"
						items={data.highlights.map((item) => ({ checked: true, text: item }))}
						gap="sm"
					/>
				</View>
				<View style={styles.col}>
					<KeyValue
						size="sm"
						divided
						items={[
							{
								key: 'Open Risks',
								value: `${data.rows.filter((row) => row.risk !== 'Low').length}`
							},
							{
								key: 'On-Track Streams',
								value: `${data.rows.filter((row) => row.status === 'On Track').length}/${data.rows.length}`
							},
							{ key: 'Avg Progress', value: `${averageProgress}%` }
						]}
					/>
				</View>
			</View>
		</Section>

		<PageFooter
			variant="three-column"
			leftText="Confidential — Internal Use"
			centerText="Generated with pdfcn"
			rightText={pageNumber}
			sticky
			pagePadding={theme.spacing.page.marginLeft}
		/>
	</Page>
</Document>

