<script lang="ts">
 import { usePdfcnTheme } from '$lib/theme-provider.svelte';
 import Document from '$lib/bases/takumi/lib/Document.svelte';
 import Page from '$lib/bases/takumi/lib/Page.svelte';
 import View from '$lib/bases/takumi/lib/View.svelte';
 import Badge from '$lib/bases/takumi/components/badge/badge.svelte';
 import DataTable from '$lib/bases/takumi/components/data-table/data-table.svelte';
 import PdfGraph from '$lib/bases/takumi/components/graph/graph.svelte';
 import type { GraphLegendPosition, GraphVariant } from '$lib/bases/takumi/components/graph/graph.types';
 import KeyValue from '$lib/bases/takumi/components/key-value/key-value.svelte';
 import PdfList from '$lib/bases/takumi/components/list/list.svelte';
 import PageFooter from '$lib/bases/takumi/components/page-footer/page-footer.svelte';
 import PageHeader from '$lib/bases/takumi/components/page-header/page-header.svelte';
 import PageNumber from '$lib/bases/takumi/components/page-number/page-number.svelte';
 import Section from '$lib/bases/takumi/components/section/section.svelte';
 import Text from '$lib/bases/takumi/components/text/text.svelte';
 import type { BaseReportData, ReportTone } from './report.types';
 interface Props {
  data: BaseReportData; titlePrefix: string; statusLabel: string; statusTone: ReportTone;
  graphVariant: GraphVariant; graphTitle: string; graphSubtitle: string;
  graphLegend?: GraphLegendPosition; graphShowValues?: boolean; graphColors?: string[];
 }
 let { data, titlePrefix, statusLabel, statusTone, graphVariant, graphTitle, graphSubtitle,
  graphLegend = 'none', graphShowValues = false, graphColors }: Props = $props();
 const theme = usePdfcnTheme();
 const toneColor = (tone: ReportTone) => tone === 'success' ? theme.colors.success : tone === 'warning' ? theme.colors.warning : tone === 'destructive' ? theme.colors.destructive : theme.colors.info;
 const styles = {
  row: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  metric: { flex: 1, padding: 10, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.primitives.borderRadius.md },
  graph: { padding: 12, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.primitives.borderRadius.md }
 };
 // A percentage is a display value, not evidence of completion or risk.
 const checkedData = $derived.by(() => {
  for (const [index, row] of data.rows.entries()) if (!Number.isFinite(row.progress) || row.progress < 0 || row.progress > 100) throw new Error(`Report row ${index + 1}: progress must be a finite percentage from 0 to 100.`);
  if (data.tableFooter?.progress !== undefined && (!Number.isFinite(data.tableFooter.progress) || data.tableFooter.progress < 0 || data.tableFooter.progress > 100)) throw new Error('Report tableFooter.progress must be a finite percentage from 0 to 100.');
  return data;
 });
</script>

{#snippet progressCell(value: unknown)}<Text noMargin>{value === '' || value === undefined ? '' : `${value}%`}</Text>{/snippet}
{#snippet pageNumber()}<PageNumber size="xs" />{/snippet}
{#snippet footer()}<PageFooter variant="three-column" leftText="Confidential — Internal Use" centerText="Generated with pdfcn" rightText={pageNumber} fixed marginTop={0} />{/snippet}

<Document title={`${titlePrefix} ${data.period}`}>
 <Page flow size="A4" margin={{ bottom: 56, left: 48, right: 48, top: 56 }}>
  {@render footer()}
  <PageHeader variant="two-column" title={data.title} subtitle={`${titlePrefix} · ${data.subtitle}`} rightText={data.period} rightSubText={`Generated ${data.generatedAt}`} marginBottom={14} />
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
   <Badge label={statusLabel} variant={statusTone} size="sm" />
   <Text variant="xs" color="mutedForeground" noMargin>Author: {data.author}</Text>
  </View>
  <Text variant="sm" transform="uppercase" color="mutedForeground">Executive Summary</Text>
  {#each Array.from({ length: Math.ceil(checkedData.summary.length / 2) }, (_, index) => index * 2) as start}
   <View wrap={false} style={styles.row}>
    {#each data.summary.slice(start, start + 2) as metric}
     <View style={{ ...styles.metric, borderLeftWidth: 3, borderLeftColor: toneColor(metric.tone ?? statusTone) }}>
      <Text variant="xs" color="mutedForeground">{metric.label}</Text>
      <Text variant="lg" weight="bold">{metric.value}</Text>
      {#if metric.trend}<Badge label={metric.trend} size="sm" variant={metric.tone ?? 'info'} />{/if}
     </View>
    {/each}
   </View>
  {/each}
  {#if data.summary.length === 0}<Text>No summary metrics supplied.</Text>{/if}
 </Page>
 <Page flow size="A4" margin={{ bottom: 56, left: 48, right: 48, top: 56 }}>

  <Section padding="none" spacing="none" noWrap style={{ marginBottom: 24 }}>
   <Text variant="sm" transform="uppercase" color="mutedForeground">Performance Trend</Text>
   <View style={styles.graph}>
    <PdfGraph variant={graphVariant} data={data.series} title={data.chartTitle ?? graphTitle} subtitle={data.chartSubtitle ?? graphSubtitle} showGrid={graphVariant !== 'pie' && graphVariant !== 'donut'} showValues={graphShowValues} smooth={graphVariant === 'line' || graphVariant === 'area'} legend={graphLegend} height={graphVariant === 'horizontal-bar' ? Math.max(210, data.series.length * 22 + 50) : 210} colors={graphColors} width={475} style={{ marginBottom: 0 }} />
   </View>
  </Section>
  <Section padding="none" spacing="none">
   <Text variant="sm" transform="uppercase" color="mutedForeground">Delivery Table</Text>
   <DataTable variant="compact" size="compact" stripe columns={[
    { header: 'Stream', key: 'label' }, { header: 'Owner', key: 'owner' },
    { align: 'center', header: 'Status', key: 'status' },
    { align: 'right', header: 'Progress', key: 'progress', render: progressCell },
    { align: 'right', header: 'Risk', key: 'risk' }
   ]} data={checkedData.rows} footer={data.tableFooter} />
   {#if data.rows.length === 0}<Text>No rows supplied.</Text>{/if}
  </Section>
 </Page>
 <Page flow size="A4" margin={{ bottom: 56, left: 48, right: 48, top: 56 }}>

  <Text variant="sm" transform="uppercase" color="mutedForeground">Highlights &amp; Notes</Text>
  <PdfList variant="bullet" items={data.highlights.map(text => ({ text }))} gap="sm" />
  {#if data.highlights.length === 0}<Text>No highlights supplied.</Text>{/if}
  {#if data.facts?.length}<KeyValue size="sm" divided items={data.facts} />{/if}
 </Page>
</Document>
