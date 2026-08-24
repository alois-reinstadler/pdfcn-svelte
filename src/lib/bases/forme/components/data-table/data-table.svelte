<script lang="ts" generics="T extends Record<string, unknown>">
	import PDFText from '$lib/bases/forme/lib/Text.svelte';
	import { usePdfcnTheme } from '$lib/theme-provider.svelte';

	import TableBody from '../table/table-body.svelte';
	import TableCell from '../table/table-cell.svelte';
	import TableFooter from '../table/table-footer.svelte';
	import TableHeader from '../table/table-header.svelte';
	import TableRow from '../table/table-row.svelte';
	import Table from '../table/table.svelte';
	import { createCompactStyles, formatValue } from './data-table.styles';
	import type { DataTableProps } from './data-table.types';

	let {
		columns,
		data,
		variant = 'grid',
		footer,
		stripe = false,
		size = 'default',
		noWrap = false,
		style
	}: DataTableProps<T> = $props();

	const theme = usePdfcnTheme();
	const compact = $derived(createCompactStyles(theme));
	const isCompact = $derived(size === 'compact');
</script>

<Table {variant} zebraStripe={stripe} {noWrap} {style}>
	<TableHeader>
		<TableRow header>
			{#each columns as column, columnIndex (column.key)}
				<TableCell
					header
					align={column.align ?? 'left'}
					width={column.width}
					style={isCompact ? compact.cell : undefined}
					_last={columnIndex === columns.length - 1}
					text={isCompact ? undefined : column.header}
				>
					{#if isCompact}
						<PDFText
							style={[compact.headerText, column.align ? { textAlign: column.align } : undefined]}
						>
							{column.header}
						</PDFText>
					{/if}
				</TableCell>
			{/each}
		</TableRow>
	</TableHeader>

	<TableBody>
		{#each data as row, rowIndex (rowIndex)}
			<TableRow>
				{#each columns as column, columnIndex (column.key)}
					{@const value = row[column.key]}
					<TableCell
						align={column.align ?? 'left'}
						width={column.width}
						style={isCompact ? compact.cell : undefined}
						_last={columnIndex === columns.length - 1}
						text={!column.render && !isCompact ? formatValue(value) : undefined}
					>
						{#if column.render}
							{@render column.render(value, row)}
						{:else if isCompact}
							<PDFText
								style={[compact.text, column.align ? { textAlign: column.align } : undefined]}
							>
								{formatValue(value)}
							</PDFText>
						{/if}
					</TableCell>
				{/each}
			</TableRow>
		{/each}
	</TableBody>

	{#if footer}
		<TableFooter>
			<TableRow footer>
				{#each columns as column, columnIndex (column.key)}
					{@const value = column.key in footer ? footer[column.key] : ''}
					<TableCell
						footer={Boolean(value)}
						align={column.align ?? 'left'}
						width={column.width}
						style={isCompact ? compact.cell : undefined}
						_last={columnIndex === columns.length - 1}
						text={!column.renderFooter && !isCompact ? formatValue(value) : undefined}
					>
						{#if column.renderFooter}
							{@render column.renderFooter(value)}
						{:else if isCompact}
							<PDFText
								style={[
									value !== '' ? compact.footerText : compact.text,
									column.align ? { textAlign: column.align } : undefined
								]}
							>
								{formatValue(value)}
							</PDFText>
						{/if}
					</TableCell>
				{/each}
			</TableRow>
		</TableFooter>
	{/if}
</Table>
