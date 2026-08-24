<script lang="ts">
	import PDFText from '$lib/bases/forme/lib/Text.svelte';
	import View from '$lib/bases/forme/lib/View.svelte';
	import { usePdfcnTheme } from '$lib/theme-provider.svelte';
	import type { Style } from '$lib/types/pdf-components';

	import { useTableRowContext } from './table-context';
	import { createTableStyles } from './table.styles';
	import type { TableCellProps, TableVariant } from './table.types';

	let {
		header,
		footer,
		align,
		width,
		variant,
		text,
		children,
		style
	}: TableCellProps = $props();

	const theme = usePdfcnTheme();
	const row = useTableRowContext();
	const cellIndex = row?.registerCell() ?? 0;
	const styles = $derived(createTableStyles(theme));
	const effectiveVariant = $derived(variant ?? row?.variant ?? 'line');
	const effectiveHeader = $derived(row ? row.header : Boolean(header));
	const effectiveFooter = $derived(row ? row.footer : Boolean(footer));

	const cellStyle = $derived.by(() => {
		const cellVariants: Partial<Record<TableVariant, Style>> = {
			bordered: styles.cellBordered,
			compact: styles.cellCompact,
			minimal: styles.cellMinimal,
			'primary-header': styles.cellPrimaryHeader,
			striped: styles.cellStriped
		};
		return [
			width === undefined ? styles.cell : styles.cellFixed,
			width === undefined ? undefined : { width },
			cellVariants[effectiveVariant],
			effectiveVariant === 'grid' && cellIndex > 0 ? styles.cellGridBorder : undefined,
			effectiveVariant === 'bordered' && cellIndex > 0
				? styles.cellBorderedBorder
				: undefined,
			align ? { textAlign: align } : undefined,
			style
		];
	});

	const textStyle = $derived.by(() => {
		const headerVariants: Record<TableVariant, Style> = {
			bordered: styles.cellTextHeaderBordered,
			compact: styles.cellTextHeaderCompact,
			grid: styles.cellTextHeaderGrid,
			line: styles.cellTextHeaderLine,
			minimal: styles.cellTextHeaderMinimal,
			'primary-header': styles.cellTextHeaderPrimaryHeader,
			striped: styles.cellTextHeaderStriped
		};
		const base = effectiveHeader
			? headerVariants[effectiveVariant]
			: effectiveFooter
				? styles.cellTextFooter
				: effectiveVariant === 'compact'
					? styles.cellTextCompact
					: styles.cellText;
		return [base, align ? { textAlign: align } : undefined, { margin: 0, padding: 0 }];
	});
</script>

<View style={cellStyle}>
	{#if text !== undefined}
		<PDFText style={textStyle}>{text}</PDFText>
	{:else}
		{@render children?.()}
	{/if}
</View>
