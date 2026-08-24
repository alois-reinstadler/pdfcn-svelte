<script lang="ts">
	import View from '$lib/bases/takumi/lib/View.svelte';
	import { flattenTakumiStyle } from '$lib/bases/takumi/lib/pdf-primitives';
	import { usePdfcnTheme } from '$lib/theme-provider.svelte';

	import {
		provideTableRowContext,
		useTableContext,
		useTableSectionContext
	} from './table-context';
	import { createTableStyles } from './table.styles';
	import type { TableRowProps, TableVariant } from './table.types';

	let {
		header = false,
		footer = false,
		stripe = false,
		variant,
		children,
		style
	}: TableRowProps = $props();

	const theme = usePdfcnTheme();
	const table = useTableContext();
	const section = useTableSectionContext();
	const bodyRowIndex = section?.kind === 'body' ? section.registerRow() : -1;
	const styles = $derived(createTableStyles(theme));
	const effectiveVariant = $derived(variant ?? table?.variant ?? 'line');
	const effectiveStripe = $derived(
		stripe ||
			(section?.kind === 'body' && Boolean(table?.zebraStripe) && bodyRowIndex % 2 === 1)
	);
	let cellIndex = 0;

	provideTableRowContext({
		get variant() {
			return effectiveVariant;
		},
		get header() {
			return header;
		},
		get footer() {
			return footer;
		},
		registerCell: () => cellIndex++
	});

	const rowStyle = $derived.by(() => {
		const variants: Record<TableVariant, Record<string, unknown>> = {
			bordered: styles.rowBordered,
			compact: styles.rowCompact,
			grid: styles.rowGrid,
			line: styles.rowLine,
			minimal: styles.rowMinimal,
			'primary-header': styles.rowPrimaryHeader,
			striped: styles.rowStriped
		};
		const headerVariants: Record<TableVariant, Record<string, unknown>> = {
			bordered: styles.rowHeaderBordered,
			compact: styles.rowHeaderCompact,
			grid: styles.rowHeaderGrid,
			line: styles.rowHeaderLine,
			minimal: styles.rowHeaderMinimal,
			'primary-header': styles.rowHeaderPrimaryHeader,
			striped: styles.rowHeaderStriped
		};
		return flattenTakumiStyle([
			{ breakInside: 'avoid' },
			styles.row,
			variants[effectiveVariant],
			header ? headerVariants[effectiveVariant] : undefined,
			footer
				? effectiveVariant === 'striped'
					? styles.rowFooterStriped
					: styles.rowFooter
				: undefined,
			effectiveStripe && !header && !footer ? styles.rowStripe : undefined,
			style
		]);
	});
</script>

<View style={rowStyle}>{@render children?.()}</View>
