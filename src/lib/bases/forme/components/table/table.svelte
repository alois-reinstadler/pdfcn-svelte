<script lang="ts">
	import View from '$lib/bases/forme/lib/View.svelte';
	import { usePdfcnTheme } from '$lib/theme-provider.svelte';

	import { provideTableContext } from './table-context';
	import { createTableStyles } from './table.styles';
	import type { TableProps, TableVariant } from './table.types';

	let {
		variant = 'line',
		zebraStripe = false,
		noWrap = false,
		children,
		style
	}: TableProps = $props();

	const theme = usePdfcnTheme();
	const styles = $derived(createTableStyles(theme));

	provideTableContext({
		get variant() {
			return variant;
		},
		get zebraStripe() {
			return variant === 'striped' || zebraStripe;
		}
	});

	const tableStyle = $derived.by(() => {
		const variants: Record<TableVariant, Record<string, unknown>> = {
			bordered: styles.tableBordered,
			compact: styles.tableCompact,
			grid: styles.tableGrid,
			line: styles.tableLine,
			minimal: styles.tableMinimal,
			'primary-header': styles.tablePrimaryHeader,
			striped: styles.tableStriped
		};
		return [styles.table, variants[variant], style];
	});
</script>

{#snippet content()}
	<View style={tableStyle}>{@render children?.()}</View>
{/snippet}

{#if noWrap}
	<View wrap={false}>{@render content()}</View>
{:else}
	{@render content()}
{/if}
