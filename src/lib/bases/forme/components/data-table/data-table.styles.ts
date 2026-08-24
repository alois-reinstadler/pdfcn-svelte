import type { Style } from '$lib/types/pdf-components';
import type { PdfcnTheme } from '$lib/types/pdf-themes';

export type DataTableCompactStyles = Record<'cell' | 'footerText' | 'headerText' | 'text', Style>;

/** Creates the denser cell and typography styles used by `size="compact"`. */
export const createCompactStyles = (t: PdfcnTheme): DataTableCompactStyles => {
	const { spacing, fontWeights, lineHeights, typography } = t.primitives;

	return {
		cell: {
			paddingHorizontal: spacing[2],
			paddingVertical: spacing[0.5]
		},
		footerText: {
			color: t.colors.foreground,
			fontFamily: t.typography.body.fontFamily,
			fontSize: typography.xs,
			fontWeight: fontWeights.semibold,
			lineHeight: lineHeights.normal
		},
		headerText: {
			color: t.colors.foreground,
			fontFamily: t.typography.body.fontFamily,
			fontSize: typography.xs,
			fontWeight: fontWeights.semibold,
			lineHeight: lineHeights.normal
		},
		text: {
			color: t.colors.foreground,
			fontFamily: t.typography.body.fontFamily,
			fontSize: typography.xs,
			lineHeight: lineHeights.normal
		}
	};
};

/** Formats the default textual representation of a cell or footer value. */
export const formatValue = (value: unknown): string => {
	if (value === null || value === undefined) return '';
	return String(value);
};
