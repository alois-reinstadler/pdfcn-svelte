import { getContext, setContext } from 'svelte';

import type { TableVariant } from './table.types';

const TABLE_CONTEXT = Symbol('pdfcn-takumi-table');
const TABLE_SECTION_CONTEXT = Symbol('pdfcn-takumi-table-section');
const TABLE_ROW_CONTEXT = Symbol('pdfcn-takumi-table-row');

export interface TableContext {
	readonly variant: TableVariant;
	readonly zebraStripe: boolean;
}

export interface TableSectionContext {
	readonly kind: 'header' | 'body' | 'footer';
	registerRow(): number;
}

export interface TableRowContext {
	readonly variant: TableVariant;
	readonly header: boolean;
	readonly footer: boolean;
	/** Returns this cell's zero-based position within the row. */
	registerCell(): number;
}

export const provideTableContext = (context: TableContext): void => {
	setContext(TABLE_CONTEXT, context);
};

export const useTableContext = (): TableContext | undefined =>
	getContext<TableContext | undefined>(TABLE_CONTEXT);

export const provideTableSectionContext = (context: TableSectionContext): void => {
	setContext(TABLE_SECTION_CONTEXT, context);
};

export const useTableSectionContext = (): TableSectionContext | undefined =>
	getContext<TableSectionContext | undefined>(TABLE_SECTION_CONTEXT);

export const provideTableRowContext = (context: TableRowContext): void => {
	setContext(TABLE_ROW_CONTEXT, context);
};

export const useTableRowContext = (): TableRowContext | undefined =>
	getContext<TableRowContext | undefined>(TABLE_ROW_CONTEXT);
