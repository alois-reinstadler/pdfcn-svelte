import type { Snippet } from 'svelte';

import type { TableVariant } from '$lib/bases/forme/components/table/table.types';
import type { PDFComponentProps } from '$lib/types/pdf-components';

/** Data-table row density. */
export type DataTableSize = 'default' | 'compact';

/** Describes one field rendered by a {@link DataTable}. */
export interface DataTableColumn<T = Record<string, unknown>> {
	/** Row property to read for this column. */
	key: keyof T & string;
	header: string;
	align?: 'left' | 'center' | 'right';
	width?: string | number;
	/** Custom cell content. The snippet receives the field value and complete row. */
	render?: Snippet<[value: unknown, row: T]>;
	/** Custom footer content. The snippet receives this column's footer value. */
	renderFooter?: Snippet<[value: unknown]>;
}

/** Props for a declarative, renderer-safe PDF data table. */
export interface DataTableProps<T = Record<string, unknown>>
	extends Omit<PDFComponentProps, 'children'> {
	columns: DataTableColumn<T>[];
	data: T[];
	/** @default 'grid' */
	variant?: TableVariant;
	/** Values keyed by column; useful for labels, totals, and summaries. */
	footer?: Partial<Record<keyof T & string, string | number>>;
	/** @default false */
	stripe?: boolean;
	/** @default 'default' */
	size?: DataTableSize;
	/** @default false */
	noWrap?: boolean;
}
