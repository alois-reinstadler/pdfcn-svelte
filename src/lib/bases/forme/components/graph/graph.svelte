<script lang="ts">
	import { Circle, G, Line, Path, Rect, Svg, SvgText } from '$lib/bases/forme/lib/pdf-svg';
	import PDFText from '$lib/bases/forme/lib/Text.svelte';
	import View from '$lib/bases/forme/lib/View.svelte';
	import { usePdfcnTheme } from '$lib/theme-provider.svelte';

	import { createGraphStyles } from './graph.styles';
	import type { GraphProps } from './graph.types';
	import {
		GRAPH_SAFE_WIDTHS,
		arcPath,
		buildLayout,
		fmtNum,
		getDefaultPalette,
		getGraphWidth,
		normalizeData,
		polarToCartesian,
		smoothPath,
		truncate
	} from './graph.utils';

	let {
		variant = 'bar',
		data,
		title,
		subtitle,
		xLabel,
		yLabel,
		width: explicitWidth,
		height = 260,
		fullWidth = false,
		containerPadding = 0,
		wrapperPadding = 0,
		colors,
		showValues = false,
		showGrid = true,
		legend = 'bottom',
		centerLabel,
		showDots = true,
		smooth = false,
		yTicks: yTickCount = 5,
		noWrap = true,
		style
	}: GraphProps = $props();

	const theme = usePdfcnTheme();
	const styles = $derived(createGraphStyles(theme));
	const palette = $derived(colors ?? getDefaultPalette(theme));
	const series = $derived(normalizeData(data));
	const width = $derived(
		fullWidth
			? getGraphWidth(theme, { containerPadding, wrapperPadding })
			: (explicitWidth ?? GRAPH_SAFE_WIDTHS.default)
	);
	const isPieOrDonut = $derived(variant === 'pie' || variant === 'donut');
	const layout = $derived(buildLayout(series, width, height, isPieOrDonut, yTickCount));
	const range = $derived(layout.yMax - layout.yMin || 1);
	const pointX = (index: number) =>
		layout.chartX +
		(index / Math.max(layout.xLabels.length - 1, 1)) * layout.chartW;
	const pointY = (value: number) =>
		layout.chartY + layout.chartH - ((value - layout.yMin) / range) * layout.chartH;
	const showLegend = $derived(legend !== 'none' && !isPieOrDonut);
	const pieCenter = $derived.by(() => {
		const cx = layout.svgW / 2;
		const cy = layout.svgH / 2;
		const radius = Math.min(layout.svgW, layout.svgH) / 2 - 20;
		return { cx, cy, radius, innerRadius: variant === 'donut' ? radius * 0.52 : 0 };
	});
	const pieGeometry = $derived.by(() => {
		const points = series[0]?.data ?? [];
		const total = points.reduce((sum, point) => sum + point.value, 0) || 1;
		const { cx, cy, radius, innerRadius } = pieCenter;
		let currentAngle = 0;
		return points.map((point, index) => {
			const sweep = (point.value / total) * 360;
			const start = currentAngle;
			const mid = start + sweep / 2;
			currentAngle += sweep;
			return {
				...point,
				color: point.color ?? palette[index % palette.length],
				index,
				innerRadius,
				cx,
				cy,
				radius,
				sweep,
				path: arcPath(cx, cy, radius, start, start + sweep, innerRadius),
				labelPoint: polarToCartesian(cx, cy, radius * 1.18, mid)
			};
		});
	});
</script>

{#snippet legendContent(position: 'bottom' | 'right')}
	<View style={position === 'right' ? styles.legendColumn : styles.legendRow}>
		{#each series as item, index (`${item.name}-${index}`)}
			<View style={styles.legendItem}>
				<Svg width={10} height={10}>
					<Rect x={0} y={2} width={8} height={8} fill={item.color ?? palette[index % palette.length]} />
				</Svg>
				<PDFText style={styles.legendText}>{item.name}</PDFText>
			</View>
		{/each}
	</View>
{/snippet}

{#snippet cartesianGrid()}
	{#each layout.yTicks as tick, index (`${tick}-${index}`)}
		{@const tickY = pointY(tick)}
		<G>
			{#if showGrid}
				<Line x1={layout.chartX} y1={tickY} x2={layout.chartX + layout.chartW} y2={tickY} stroke={theme.colors.border} strokeWidth={0.5} strokeDasharray="3 3" />
			{/if}
			<SvgText x={layout.chartX - 4} y={tickY + 3} fill={theme.colors.mutedForeground} textAnchor="end" style={{ fontSize: 7 }}>{fmtNum(tick)}</SvgText>
		</G>
	{/each}
{/snippet}

{#snippet chartSvg()}
	<Svg width={width} height={height}>
		{#if variant === 'bar'}
			{@render cartesianGrid()}
			<Line x1={layout.chartX} y1={layout.chartY + layout.chartH} x2={layout.chartX + layout.chartW} y2={layout.chartY + layout.chartH} stroke={theme.colors.foreground} strokeWidth={1} />
			{@const categoryCount = Math.max(layout.xLabels.length, 1)}
			{@const seriesCount = Math.max(series.length, 1)}
			{@const groupWidth = layout.chartW / categoryCount}
			{@const barWidth = (groupWidth * 0.75) / seriesCount}
			{#each layout.xLabels as label, categoryIndex (`${label}-${categoryIndex}`)}
				{@const groupLeft = layout.chartX + categoryIndex * groupWidth + groupWidth * 0.125}
				<G>
					{#each series as item, seriesIndex (`${item.name}-${seriesIndex}`)}
						{@const value = item.data[categoryIndex]?.value ?? 0}
						{@const barHeight = ((value - layout.yMin) / range) * layout.chartH}
						{@const barX = groupLeft + seriesIndex * barWidth}
						{@const barY = layout.chartY + layout.chartH - barHeight}
						<G>
							<Rect x={barX} y={barY} width={barWidth - 1} height={barHeight} fill={item.data[categoryIndex]?.color ?? item.color ?? palette[seriesIndex % palette.length]} />
							{#if showValues && barHeight > 10}
								<SvgText x={barX + barWidth / 2 - 0.5} y={barY - 2} fill={theme.colors.foreground} textAnchor="middle" style={{ fontSize: 6 }}>{fmtNum(value)}</SvgText>
							{/if}
						</G>
					{/each}
					<SvgText x={groupLeft + (series.length * barWidth) / 2} y={layout.chartY + layout.chartH + 10} fill={theme.colors.mutedForeground} textAnchor="middle" style={{ fontSize: 7 }}>{truncate(label, 10)}</SvgText>
				</G>
			{/each}
		{:else if variant === 'horizontal-bar'}
			{@const rowHeight = layout.chartH / Math.max(layout.xLabels.length, 1)}
			{@const barHeight = rowHeight * 0.5}
			{@const labelWidth = 60}
			{@const maximum = Math.max(...series.flatMap((item) => item.data.map((point) => point.value)), 1)}
			{#each layout.xLabels as label, categoryIndex (`${label}-${categoryIndex}`)}
				{@const rowY = layout.chartY + categoryIndex * rowHeight}
				{@const value = series[0]?.data[categoryIndex]?.value ?? 0}
				{@const barWidth = (value / maximum) * (layout.chartW - labelWidth)}
				<G>
					<SvgText x={layout.chartX + labelWidth - 4} y={rowY + rowHeight / 2 + 3} fill={theme.colors.mutedForeground} textAnchor="end" style={{ fontSize: 7 }}>{truncate(label, 14)}</SvgText>
					<Rect x={layout.chartX + labelWidth} y={rowY + (rowHeight - barHeight) / 2} width={Math.max(barWidth, 1)} height={barHeight} fill={series[0]?.data[categoryIndex]?.color ?? series[0]?.color ?? palette[categoryIndex % palette.length]} />
					{#if showValues}<SvgText x={layout.chartX + labelWidth + barWidth + 3} y={rowY + rowHeight / 2 + 3} fill={theme.colors.foreground} textAnchor="start" style={{ fontSize: 6 }}>{fmtNum(value)}</SvgText>{/if}
				</G>
			{/each}
			<Line x1={layout.chartX + labelWidth} y1={layout.chartY} x2={layout.chartX + labelWidth} y2={layout.chartY + layout.chartH} stroke={theme.colors.foreground} strokeWidth={1} />
		{:else if variant === 'line' || variant === 'area'}
			{@render cartesianGrid()}
			<Line x1={layout.chartX} y1={layout.chartY + layout.chartH} x2={layout.chartX + layout.chartW} y2={layout.chartY + layout.chartH} stroke={theme.colors.foreground} strokeWidth={1} />
			{#each series as item, seriesIndex (`${item.name}-${seriesIndex}`)}
				{@const color = item.color ?? palette[seriesIndex % palette.length]}
				{@const points = item.data.map((point, index) => ({ x: pointX(index), y: pointY(point.value) }))}
				{@const linePath = smooth ? smoothPath(points) : points.length ? `M ${points.map((point) => `${point.x} ${point.y}`).join(' L ')}` : ''}
				{@const first = points[0]}
				{@const last = points.at(-1)}
				{@const areaPath = variant === 'area' && points.length > 1 && first && last ? `${linePath} L ${last.x} ${layout.chartY + layout.chartH} L ${first.x} ${layout.chartY + layout.chartH} Z` : undefined}
				<G>
					{#if areaPath}<Path d={areaPath} fill={color} fillOpacity={0.2} stroke="none" />{/if}
					{#if linePath}<Path d={linePath} stroke={color} strokeWidth={2} fill="none" />{/if}
					{#if showDots}{#each points as point, pointIndex (pointIndex)}<Circle cx={point.x} cy={point.y} r={3} fill={color} />{/each}{/if}
					{#if showValues}{#each points as point, pointIndex (pointIndex)}<SvgText x={point.x} y={point.y - 5} fill={color} textAnchor="middle" style={{ fontSize: 6 }}>{fmtNum(item.data[pointIndex].value)}</SvgText>{/each}{/if}
				</G>
			{/each}
			{#each layout.xLabels as label, index (`${label}-${index}`)}<SvgText x={pointX(index)} y={layout.chartY + layout.chartH + 10} fill={theme.colors.mutedForeground} textAnchor="middle" style={{ fontSize: 7 }}>{truncate(label, 8)}</SvgText>{/each}
		{:else}
			{#each pieGeometry as slice (slice.index)}
				<G>
					<Path d={slice.path} fill={slice.color} stroke="white" strokeWidth={1} />
					{#if slice.sweep > 15}<SvgText x={slice.labelPoint.x} y={slice.labelPoint.y + 3} fill={theme.colors.mutedForeground} textAnchor={slice.labelPoint.x > slice.cx ? 'start' : 'end'} style={{ fontSize: 7 }}>{truncate(slice.label, 10)}</SvgText>{/if}
				</G>
			{/each}
			{#if variant === 'donut' && centerLabel}
				<Circle cx={pieCenter.cx} cy={pieCenter.cy} r={pieCenter.innerRadius} fill="white" />
				<SvgText x={pieCenter.cx} y={pieCenter.cy + 4} fill={theme.colors.foreground} textAnchor="middle" style={{ fontSize: 9, fontWeight: 'bold' }}>{centerLabel}</SvgText>
			{/if}
		{/if}
		{#if !isPieOrDonut && xLabel}<SvgText x={layout.chartX + layout.chartW / 2} y={height - 2} fill={theme.colors.mutedForeground} textAnchor="middle" style={{ fontSize: 8 }}>{xLabel}</SvgText>{/if}
		{#if !isPieOrDonut && yLabel}<SvgText x={2} y={10} fill={theme.colors.mutedForeground} textAnchor="start" style={{ fontSize: 8 }}>{yLabel}</SvgText>{/if}
	</Svg>
{/snippet}

{#snippet textFallback()}
	<View style={{ height: layout.svgH, left: 0, position: 'absolute', top: 0, width: layout.svgW }}>
		{#if isPieOrDonut}
			{#each pieGeometry as slice (slice.index)}
				{#if slice.sweep > 15}<PDFText style={{ color: theme.colors.mutedForeground, fontSize: 7, left: slice.labelPoint.x > slice.cx ? slice.labelPoint.x : slice.labelPoint.x - 60, lineHeight: 1, position: 'absolute', textAlign: slice.labelPoint.x > slice.cx ? 'left' : 'right', top: slice.labelPoint.y - 4, width: 60 }}>{truncate(slice.label, 10)}</PDFText>{/if}
			{/each}
		{:else if variant === 'horizontal-bar'}
			{@const rowHeight = layout.chartH / Math.max(layout.xLabels.length, 1)}
			{@const maximum = Math.max(...series.flatMap((item) => item.data.map((point) => point.value)), 1)}
			{#each layout.xLabels as label, index (`${label}-${index}`)}
				{@const value = series[0]?.data[index]?.value ?? 0}
				{@const barWidth = (value / maximum) * (layout.chartW - 60)}
				<PDFText style={{ color: theme.colors.mutedForeground, fontSize: 7, left: layout.chartX, lineHeight: 1, position: 'absolute', textAlign: 'right', top: layout.chartY + index * rowHeight + rowHeight / 2 - 4, width: 56 }}>{truncate(label, 14)}</PDFText>
				{#if showValues}<PDFText style={{ color: theme.colors.mutedForeground, fontSize: 6, left: layout.chartX + 60 + barWidth + 3, lineHeight: 1, position: 'absolute', top: layout.chartY + index * rowHeight + rowHeight / 2 - 4, width: 28 }}>{fmtNum(value)}</PDFText>{/if}
			{/each}
		{:else}
			{#each layout.yTicks as tick, index (`${tick}-${index}`)}<PDFText style={{ color: theme.colors.mutedForeground, fontSize: 7, left: 0, lineHeight: 1, position: 'absolute', textAlign: 'right', top: pointY(tick) - 4, width: layout.chartX - 4 }}>{fmtNum(tick)}</PDFText>{/each}
			{#if variant === 'line' || variant === 'area'}{#each layout.xLabels as label, index (`${label}-${index}`)}<PDFText style={{ color: theme.colors.mutedForeground, fontSize: 7, left: pointX(index) - 12, lineHeight: 1, position: 'absolute', textAlign: 'center', top: layout.chartY + layout.chartH + 3, width: 24 }}>{truncate(label, 8)}</PDFText>{/each}{/if}
			{#if variant === 'bar' && showValues}
				{@const groupWidth = layout.chartW / Math.max(layout.xLabels.length, 1)}
				{@const barWidth = Math.max((groupWidth - 2 * (series.length + 1)) / Math.max(series.length, 1), 1)}
				{#each layout.xLabels as label, categoryIndex (`${label}-${categoryIndex}`)}{#each series as item, seriesIndex (`${item.name}-${seriesIndex}`)}{@const value = item.data[categoryIndex]?.value ?? 0}<PDFText style={{ color: theme.colors.mutedForeground, fontSize: 6, left: layout.chartX + categoryIndex * groupWidth + 2 + seriesIndex * (barWidth + 2), lineHeight: 1, position: 'absolute', textAlign: 'center', top: pointY(value) - 8, width: barWidth }}>{fmtNum(value)}</PDFText>{/each}{/each}
			{/if}
		{/if}
	</View>
{/snippet}

{#snippet content()}
	<View style={[styles.container, style]}>
		{#if title}<PDFText style={styles.title}>{title}</PDFText>{/if}
		{#if subtitle}<PDFText style={styles.subtitle}>{subtitle}</PDFText>{/if}
		<View style={legend === 'right' ? styles.chartWithRightLegend : undefined}>
			<View style={{ height, position: 'relative', width }}>{@render chartSvg()}{@render textFallback()}</View>
			{#if showLegend && legend === 'right'}{@render legendContent('right')}{/if}
		</View>
		{#if variant === 'bar'}<View style={{ display: 'flex', flexDirection: 'row', marginLeft: layout.chartX, width: layout.chartW }}>{#each series[0]?.data ?? [] as point, index (`${point.label}-${index}`)}<View style={{ alignItems: 'center', flex: 1 }}><PDFText style={{ fontSize: 7 }}>{truncate(point.label, 10)}</PDFText></View>{/each}</View>{/if}
		{#if showLegend && legend === 'bottom'}{@render legendContent('bottom')}{/if}
	</View>
{/snippet}

{#if noWrap}<View wrap={false}>{@render content()}</View>{:else}{@render content()}{/if}
