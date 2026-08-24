import type { PDFComponentProps } from '$lib/types/pdf-components';

/** Table visual style variant. */
export type TableVariant =
	| 'line'
	| 'grid'
	| 'minimal'
	| 'striped'
	| 'compact'
	| 'bordered'
	| 'primary-header';

export interface TableProps extends PDFComponentProps {
	/** @default 'line' */
	variant?: TableVariant;
	/** @default false */
	zebraStripe?: boolean;
	/** @default false */
	noWrap?: boolean;
}

export type TableSectionProps = PDFComponentProps;

export interface TableRowProps extends PDFComponentProps {
	header?: boolean;
	footer?: boolean;
	stripe?: boolean;
	variant?: TableVariant;
}

export interface TableCellProps extends PDFComponentProps {
	header?: boolean;
	footer?: boolean;
	align?: 'left' | 'center' | 'right';
	width?: string | number;
	variant?: TableVariant;
	/**
	 * @deprecated Internal dividers are inferred from the cell's row position.
	 * Retained for source compatibility with upstream pdfcn call sites.
	 */
	_last?: boolean;
	/**
	 * Styled plain-text content. Use `children` for arbitrary component content.
	 */
	text?: string | number;
}
