export { default as PdfcnThemeProvider } from './PdfcnThemeProvider.svelte';
export { providePdfcnTheme, usePdfcnTheme } from './theme-provider.svelte.js';

export * from './themes/index.js';
export type { PDFComponentProps, Style } from './types/pdf-components.js';
export type {
	BorderRadiusScale,
	ColorTokens,
	FontWeights,
	LetterSpacingScale,
	LineHeights,
	PageTokens,
	PdfcnTheme,
	PrimitiveTokens,
	SpacingScale,
	SpacingTokens,
	TypographyScale,
	TypographyTokens
} from './types/pdf-themes.js';

export { cn } from './utils.js';
export { resolveColor, THEME_COLOR_KEYS } from './utils/resolve-color.js';
