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
	// Forme ships the core Helvetica face. Takumi maps the generic sans-serif
	// family to its bundled Geist fallback, keeping previews offline and
	// deterministic without claiming that Helvetica was registered there.
	const fontFamily = renderer === 'forme' ? 'Helvetica' : 'sans-serif';

	return {
		...theme,
		typography: {
			body: { ...theme.typography.body, fontFamily },
			heading: { ...theme.typography.heading, fontFamily }
		}
	};
}
