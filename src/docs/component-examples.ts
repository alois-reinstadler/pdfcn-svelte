import type { Component } from 'svelte';
export const exampleSources = import.meta.glob('./examples/*/*.svelte', {
	eager: true,
	query: '?raw',
	import: 'default'
}) as Record<string, string>;
export const exampleComponents = import.meta.glob(
	'./examples/takumi/*.svelte',
	{ eager: true, import: 'default' }
) as Record<string, Component>;
export { packageSource } from './package-source.mjs';
export const componentNotes: Record<string, string> = {
	'data-table':
		'columns and data are required. Use a record-shaped row type. A render snippet receives an unknown field value plus the typed full row; renderFooter receives only the footer value. Column widths apply to headers and body cells. Prefer numeric point widths with Forme: percentage widths can inflate row heights in the current engine. Compute and format money in your application; the table does not calculate totals.',
	graph:
		'data accepts one GraphDataPoint[] or multiple named GraphSeries[]. Variants: bar, horizontal-bar, line, area, pie, donut. Pie/donut use the first series. Use matching labels across series. width and height are points, not CSS pixels. Choose an explicit width that fits the page; fullWidth uses preset page geometry, not a browser ResizeObserver. Graphs are kept together by default.',
	form: 'Form draws blank boxes or lines for printing. It does not create interactive AcroForm fields and has no value, binding, validation, or submit API. Use KeyValue for completed values. Field height defaults to 18 points; groups choose single, two-column, or three-column layout.',
	'page-number':
		'The PDF below contains a real page break and page totals resolved by the renderer. Forme uses fixed footer content; Takumi uses a single flowing Page and PageFooter. Browser HTML cannot prove physical PDF pagination. Takumi fixed on PageNumber alone does not repeat it: place it in PageFooter in flow mode.',
	'page-footer':
		'Forme fixed or sticky places the footer in the native repeated footer region. Takumi repeats one PageFooter per flowing Page via its server adapter; fixed is accepted but not implemented independently. Reserve enough bottom margin for the footer. A Takumi document supports one flow Page and one footer. Browser flow previews omit this server-rendered footer.',
	'page-header':
		'Forme fixed can repeat the header. Takumi currently renders PageHeader once in document flow: fixed is accepted for API parity but ignored. For explicitly authored pages, place a header in each page yourself. Do not promise automatic repeated headers in Takumi.',
	'keep-together':
		'Keeps a short section together where the renderer supports it. Content must fit on a physical page. Takumi minPresenceAhead is accepted but ignored; Forme passes it to its native layout. Test the rendered PDF with your longest real content.',
	'page-break':
		'Place inside document content to begin the next physical page. Use flow on a single Takumi Page for variable-length documents. The downloadable example exercises the break; HTML alone does not show its final physical-page effect.',
	'pdf-image':
		'Use a PNG/JPEG data URI for portable, self-contained output, or a reachable URL supported by your renderer. Forme also accepts server file paths; browser paths are not server filesystem paths. Forme rejects structured request objects. Takumi reads only uri and ignores method, headers, and body: fetch protected assets yourself and pass a data URI. Give explicit width and height in points; aspectRatio computes height only with a numeric width and no preset height.',
	watermark:
		'Place at document/page context and verify the generated PDF. It is decorative text, not document protection. Renderer stacking and repetition differ; a browser preview does not establish physical-page placement.',
	table:
		'Compose TableHeader, TableBody, TableFooter, TableRow and TableCell within Table. Set header on heading rows and cells; use matching cell widths across all rows. For Forme, use numeric point widths; percentage widths can inflate row heights. TableCell text provides themed plain text; children allows custom components. noWrap keeps the whole table together, so leave it false for long datasets.',
	signature:
		'Draws signer lines and printed details. This is not a cryptographic signature or interactive signature field. double accepts exactly two signer objects.',
	heading:
		'level selects the theme font scale (1–6). Forme keepWithNext asks the renderer to keep the heading with following content. Takumi accepts but ignores this prop because its PDF engine rejects breakAfter: avoid; wrap a short heading/content group in KeepTogether instead. Always inspect a PDF with long text.',
	link: 'href is required. PDF links use the selected renderer’s link primitive; check clickable annotations in your target viewer. children supplies the link text.',
	qrcode:
		'value is required. Generated QR modules are vector shapes; size and quiet-zone margin affect scan reliability. Test your final printed output with a real scanner.'
};
export const pdfOnly = new Set([
	'page-break',
	'page-number',
	'page-footer',
	'page-header',
	'keep-together',
	'watermark'
]);
