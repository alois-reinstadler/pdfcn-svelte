import type { PdfcnTheme } from '$lib/types/pdf-themes';

export type PdfPreviewRenderer = 'forme' | 'takumi';

/**
 * Makes the checked-in showcase PDFs deterministic without redistributing a
 * third-party font binary. Public theme presets keep their upstream font
 * choices; applications can register those faces with either renderer.
 */
export function createPdfPreviewTheme(
	theme: PdfcnTheme,
	renderer: PdfPreviewRenderer
): PdfcnTheme {
	const fontFamily = renderer === 'forme' ? 'Helvetica' : 'Helvetica, Arial, sans-serif';

	return {
		...theme,
		typography: {
			body: { ...theme.typography.body, fontFamily },
			heading: { ...theme.typography.heading, fontFamily }
		}
	};
}
