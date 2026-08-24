import { getContext, setContext } from 'svelte';

import { professionalTheme } from '$lib/themes/professional';
import type { PdfcnTheme } from '$lib/types/pdf-themes';

const PDFCN_THEME_KEY = Symbol('pdfcn-theme');

/**
 * Provides a theme to all pdfcn-svelte components below this point in the
 * component tree. Call once during component initialisation (the
 * `PdfcnThemeProvider` component does this for you).
 */
export function providePdfcnTheme(
	theme: PdfcnTheme = professionalTheme
): PdfcnTheme {
	setContext(PDFCN_THEME_KEY, theme);
	return theme;
}

/**
 * Reads the closest provided theme, falling back to the professional preset.
 */
export function usePdfcnTheme(): PdfcnTheme {
	return getContext<PdfcnTheme | undefined>(PDFCN_THEME_KEY) ?? professionalTheme;
}
