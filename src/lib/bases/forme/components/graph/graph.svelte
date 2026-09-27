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
		validateGraph,
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
	const palette = $derived.by(() => {
		if (colors && colors.length === 0) throw new Error('[Graph] colors must contain at least one color.');
		return colors ?? getDefaultPalette(theme);
	});
	const series = $derived(validateGraph(data, variant));
	const width = $derived(
		fullWidth
			? getGraphWidth(theme, { containerPadding, wrapperPadding })
			: (explicitWidth ?? GRAPH_SAFE_WIDTHS.default)
	);
	const isPieOrDonut = $derived(variant === 'pie' || variant === 'donut');
	const layout = $derived.by(() => {
		if (fullWidth && explicitWidth !== undefined) throw new Error('[Graph] Choose width or fullWidth, not both.');
		if (!fullWidth && (containerPadding !== 0 || wrapperPadding !== 0)) throw new Error('[Graph] containerPadding/wrapperPadding require fullWidth=true.');
		if (centerLabel && variant !== 'donut') throw new Error('[Graph] centerLabel requires variant="donut".');
		if (isPieOrDonut && (xLabel || yLabel)) throw new Error('[Graph] Pie/donut charts have no axes. Use title/subtitle instead.');
		if (smooth && !['line', 'area'].includes(variant)) throw new Error('[Graph] smooth applies only to line and area charts.');
		if (['line', 'area'].includes(variant) && !showDots && series.some(item => item.data.some(point => point.color !== undefined))) throw new Error('[Graph] Per-point colors require showDots=true for line/area charts. Set series.color for a continuous line color.');
		const result = buildLayout(series, width, height, isPieOrDonut, yTickCount);
		const count = result.xLabels.length;
		if (count > 100 || (!isPieOrDonut && count > 0 && (variant === 'horizontal-bar' ? result.chartH : result.chartW) / count < (variant === 'horizontal-bar' ? 18 : 32))) throw new Error('[Graph] Too many categories for readable labels. Increase the chart dimensions or split the data into separate charts.');
		return result;
	});
	const range = $derived(layout.yMax - layout.yMin || 1);
	const pointX = (index: number) =>
		layout.chartX +
		(layout.xLabels.length <= 1 ? 0.5 : index / (layout.xLabels.length - 1)) * layout.chartW;
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
			<Line x1={layout.chartX} y1={pointY(0)} x2={layout.chartX + layout.chartW} y2={pointY(0)} stroke={theme.colors.foreground} strokeWidth={1} />
			{@const categoryCount = Math.max(layout.xLabels.length, 1)}
			{@const seriesCount = Math.max(series.length, 1)}
			{@const groupWidth = layout.chartW / categoryCount}
			{@const barWidth = (groupWidth * 0.75) / seriesCount}
			{#each layout.xLabels as label, categoryIndex (`${label}-${categoryIndex}`)}
				{@const groupLeft = layout.chartX + categoryIndex * groupWidth + groupWidth * 0.125}
				<G>
					{#each series as item, seriesIndex (`${item.name}-${seriesIndex}`)}
						{@const value = item.data[categoryIndex]?.value ?? 0}
						{@const barHeight = Math.abs(pointY(value) - pointY(0))}
						{@const barX = groupLeft + seriesIndex * barWidth}
						{@const barY = Math.min(pointY(value), pointY(0))}
						<G>
							<Rect x={barX} y={barY} width={Math.max(barWidth - 1, 0)} height={barHeight} fill={item.data[categoryIndex]?.color ?? item.color ?? palette[seriesIndex % palette.length]} />
							{#if showValues}
								<SvgText x={barX + barWidth / 2 - 0.5} y={(value < 0 ? pointY(0) : barY) - 2} fill={theme.colors.foreground} textAnchor="middle" style={{ fontSize: 6 }}>{fmtNum(value)}</SvgText>
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
			{#if showGrid}{#each layout.yTicks as tick}<Line x1={layout.chartX + labelWidth + ((tick - layout.yMin) / range) * (layout.chartW - labelWidth)} x2={layout.chartX + labelWidth + ((tick - layout.yMin) / range) * (layout.chartW - labelWidth)} y1={layout.chartY} y2={layout.chartY + layout.chartH} stroke={theme.colors.border} strokeWidth={0.5} strokeDasharray="3 3" />{/each}{/if}
			{#each layout.xLabels as label, categoryIndex (`${label}-${categoryIndex}`)}
				{@const rowY = layout.chartY + categoryIndex * rowHeight}
				{@const value = series[0]?.data[categoryIndex]?.value ?? 0}
				{@const barWidth = (Math.abs(value) / range) * (layout.chartW - labelWidth)}
				<G>
					<SvgText x={layout.chartX + labelWidth - 4} y={rowY + rowHeight / 2 + 3} fill={theme.colors.mutedForeground} textAnchor="end" style={{ fontSize: 7 }}>{truncate(label, 14)}</SvgText>
					<Rect x={layout.chartX + labelWidth + ((Math.min(value, 0) - layout.yMin) / range) * (layout.chartW - labelWidth)} y={rowY + (rowHeight - barHeight) / 2} width={barWidth} height={barHeight} fill={series[0]?.data[categoryIndex]?.color ?? series[0]?.color ?? palette[categoryIndex % palette.length]} />
					{#if showValues}<SvgText x={layout.chartX + labelWidth + ((value - layout.yMin) / range) * (layout.chartW - labelWidth) + 3} y={rowY + rowHeight / 2 + 3} fill={theme.colors.foreground} textAnchor="start" style={{ fontSize: 6 }}>{fmtNum(value)}</SvgText>{/if}
				</G>
			{/each}
			<Line x1={layout.chartX + labelWidth + (-layout.yMin / range) * (layout.chartW - labelWidth)} y1={layout.chartY} x2={layout.chartX + labelWidth + (-layout.yMin / range) * (layout.chartW - labelWidth)} y2={layout.chartY + layout.chartH} stroke={theme.colors.foreground} strokeWidth={1} />
		{:else if variant === 'line' || variant === 'area'}
			{@render cartesianGrid()}
			<Line x1={layout.chartX} y1={pointY(0)} x2={layout.chartX + layout.chartW} y2={pointY(0)} stroke={theme.colors.foreground} strokeWidth={1} />
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
					{#if showDots}{#each points as point, pointIndex (pointIndex)}<Circle cx={point.x} cy={point.y} r={3} fill={item.data[pointIndex].color ?? color} />{/each}{/if}
					{#if showValues}{#each points as point, pointIndex (pointIndex)}<SvgText x={point.x} y={point.y - 5} fill={color} textAnchor="middle" style={{ fontSize: 6 }}>{fmtNum(item.data[pointIndex].value)}</SvgText>{/each}{/if}
				</G>
			{/each}
			{#each layout.xLabels as label, index (`${label}-${index}`)}<SvgText x={pointX(index)} y={layout.chartY + layout.chartH + 10} fill={theme.colors.mutedForeground} textAnchor="middle" style={{ fontSize: 7 }}>{truncate(label, 8)}</SvgText>{/each}
		{:else}
			{#each pieGeometry as slice (slice.index)}
				<G>
					<Path d={slice.path} fill={slice.color} stroke="white" strokeWidth={1} />
					
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
			{#if variant === 'donut' && centerLabel}<PDFText style={{ color: theme.colors.foreground, fontSize: 9, fontWeight: 'bold', position: 'absolute', top: pieCenter.cy - 5, left: pieCenter.cx - pieCenter.innerRadius, width: pieCenter.innerRadius * 2, textAlign: 'center' }}>{centerLabel}</PDFText>{/if}
		{:else if variant === 'horizontal-bar'}
			{@const rowHeight = layout.chartH / Math.max(layout.xLabels.length, 1)}
			{@const maximum = Math.max(...series.flatMap((item) => item.data.map((point) => point.value)), 1)}
			{#each layout.xLabels as label, index (`${label}-${index}`)}
				{@const value = series[0]?.data[index]?.value ?? 0}
				{@const barWidth = (Math.abs(value) / range) * (layout.chartW - 60)}
				<PDFText style={{ color: theme.colors.mutedForeground, fontSize: 7, left: layout.chartX, lineHeight: 1, position: 'absolute', textAlign: 'right', top: layout.chartY + index * rowHeight + rowHeight / 2 - 4, width: 56 }}>{truncate(label, 14)}</PDFText>
				{#if showValues}<PDFText style={{ color: theme.colors.mutedForeground, fontSize: 6, left: layout.chartX + 60 + ((value - layout.yMin) / range) * (layout.chartW - 60) + 3, lineHeight: 1, position: 'absolute', top: layout.chartY + index * rowHeight + rowHeight / 2 - 4, width: 28 }}>{fmtNum(value)}</PDFText>{/if}
			{/each}
		{:else}
			{#each layout.yTicks as tick, index (`${tick}-${index}`)}<PDFText style={{ color: theme.colors.mutedForeground, fontSize: 7, left: 0, lineHeight: 1, position: 'absolute', textAlign: 'right', top: pointY(tick) - 4, width: layout.chartX - 4 }}>{fmtNum(tick)}</PDFText>{/each}
			{#if variant === 'line' || variant === 'area'}{#each layout.xLabels as label, index (`${label}-${index}`)}<PDFText style={{ color: theme.colors.mutedForeground, fontSize: 7, left: pointX(index) - Math.min(80, layout.chartW / Math.max(layout.xLabels.length - 1, 1)) / 2, lineHeight: 1, position: 'absolute', textAlign: 'center', top: layout.chartY + layout.chartH + 3, width: Math.min(80, layout.chartW / Math.max(layout.xLabels.length - 1, 1)) }}>{truncate(label, 8)}</PDFText>{/each}{/if}
			{#if variant === 'bar' && showValues}
				{@const groupWidth = layout.chartW / Math.max(layout.xLabels.length, 1)}
				{@const barWidth = Math.max((groupWidth - 2 * (series.length + 1)) / Math.max(series.length, 1), 1)}
				{#each layout.xLabels as label, categoryIndex (`${label}-${categoryIndex}`)}{#each series as item, seriesIndex (`${item.name}-${seriesIndex}`)}{@const value = item.data[categoryIndex]?.value ?? 0}<PDFText style={{ color: theme.colors.mutedForeground, fontSize: 6, left: layout.chartX + categoryIndex * groupWidth + 2 + seriesIndex * (barWidth + 2), lineHeight: 1, position: 'absolute', textAlign: 'center', top: (value < 0 ? pointY(0) : pointY(value)) - 8, width: barWidth }}>{fmtNum(value)}</PDFText>{/each}{/each}
			{/if}
		{/if}
		{#if !isPieOrDonut && (variant === 'line' || variant === 'area') && showValues}
			{#each series as item}{#each item.data as point, index}<PDFText style={{ color: theme.colors.foreground, fontSize: 6, position: 'absolute', left: pointX(index) - 18, top: pointY(point.value) - 11, width: 36, textAlign: 'center' }}>{fmtNum(point.value)}</PDFText>{/each}{/each}
		{/if}
		{#if !isPieOrDonut && xLabel}<PDFText style={{ fontSize: 8, position: 'absolute', left: layout.chartX, top: height - 10, width: layout.chartW, textAlign: 'center' }}>{xLabel}</PDFText>{/if}
		{#if !isPieOrDonut && yLabel}<PDFText style={{ fontSize: 8, position: 'absolute', left: 2, top: 2, width: layout.chartW }}>{yLabel}</PDFText>{/if}
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
		{#if isPieOrDonut}<View style={styles.legendRow}>{#each series[0]?.data ?? [] as point}<View style={styles.legendItem}><PDFText style={styles.legendText}>{point.label}{#if showValues}: {fmtNum(point.value)}{/if}</PDFText></View>{/each}</View>{/if}
		{#if !isPieOrDonut && layout.xLabels.some(label => label.length > (variant === 'horizontal-bar' ? 14 : variant === 'bar' ? 10 : 8))}
			<View style={{ width }}>{#each layout.xLabels as label, index}{#if label.length > (variant === 'horizontal-bar' ? 14 : variant === 'bar' ? 10 : 8)}<PDFText style={styles.legendText}>{index + 1}. {label}</PDFText>{/if}{/each}</View>
		{/if}
		{#if showLegend && legend === 'bottom'}{@render legendContent('bottom')}{/if}
	</View>
{/snippet}

{#if noWrap}<View wrap={false}>{@render content()}</View>{:else}{@render content()}{/if}
