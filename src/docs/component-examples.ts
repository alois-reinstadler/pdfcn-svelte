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
 'data-table': 'columns and data are required. A render snippet receives the field value and full row; renderFooter receives the supplied footer value. Numeric column widths are points. Forme 0.25 resolves the older engine’s percentage-width row-height bug. The table formats values but does not calculate totals. Each row must fit on one physical page; split oversized cell content into additional rows or place it in flowing Text outside the table.',
 graph: 'data accepts GraphDataPoint[] or named GraphSeries[]. Multi-series charts require matching labels. Pie/donut and horizontal-bar accept a single series; unsupported combinations raise an error instead of dropping data. Values must be finite. Negative pie/donut values are invalid. Dimensions are points; choose a width and label density that fit your page.',
 form: 'PrintableForm draws blank fields for handwritten completion. It has no interactive field, binding, validation, or submit API. Form and PdfForm are deprecated aliases. Use KeyValue for completed values.',
 signature: 'PrintableSignature draws signer lines and printed details. It creates neither interactive fields nor cryptographic signatures. Signature and PdfSignatureBlock are deprecated aliases. The double variant requires exactly two signers.',
 'page-number': 'These examples show a real break and physical page totals. For Takumi, place page numbers in a repeated PageFooter or PageHeader. Browser HTML is an unpaginated layout preview; inspect the generated physical pages below.',
 'page-footer': 'Forme fixed or sticky uses the native repeated footer region; declare it before all body content inside Page. Takumi fixed footers repeat across flowing pages; declare the document-wide band once. Multiple bands stack, and identical bands across authored sections are deduplicated. Reserve enough bottom margin; a band that cannot fit raises an error.',
 'page-header': 'Use fixed to repeat the header. Forme uses its native header region and requires fixed declarations before body content; Takumi extracts the band during PDF rendering. Reserve top margin for the band. Takumi flowing sections share the repeated document header; declare it once. Without fixed the header stays inline.',
 'keep-together': 'KeepTogether groups a short section that fits on one page. Takumi minPresenceAhead reserves minimum following space by grouping measured siblings; impossible groups raise an error. Forme does not implement minimum-presence measurements and rejects that option: include the required following content inside KeepTogether instead.',
 'page-break': 'Place inside page content to begin the next physical page. Use flow on Takumi Page for variable-length documents. Multiple flowing authored pages can share the same paper size and margins. Mixed geometry is rejected; render different paper sizes as separate documents.',
 'pdf-image': 'src is a string: use a PNG/JPEG data URI for self-contained output. Resolve protected requests with await loadImage({ uri, headers, method, body }) before rendering; passing a request object directly is rejected. Forme requires validated PNG/JPEG data; use imageDataUri(await readFile(path)) for server files. Forme supports fill only and rejects crop/position options; preserve natural proportions using one numeric dimension or preprocess the image. Takumi supports its declared fit/position modes. Numeric dimensions use points.',
 watermark: 'Decorative printed text, without document protection. Forme supports a centered repeated watermark; unsupported placement and fixed=false raise errors. Takumi flowing pages reject watermarks: place a DRAFT label in a repeated PageHeader instead. Authored-page watermarks require inspecting the final PDF.',
 table: 'Compose TableHeader, TableBody, TableFooter, TableRow and TableCell. Use matching widths across rows. Forme percentage widths resolve against the available row width; numeric widths are points. text provides themed plain content and children supplies custom components. Leave noWrap false for long datasets; a keep-together table must fit on one physical page. Rows are atomic: split oversized content into multiple rows or place it in flowing Text outside the table.',
 heading: 'level selects the theme scale (1–6). Takumi keepWithNext groups the heading with the next sibling during measured PDF layout. Forme rejects keepWithNext=true because its engine cannot implement it: wrap the heading and following short content in KeepTogether, as the Forme example shows.',
 link: 'href is required. Links use the renderer’s PDF link primitive; children supplies the visible link text.',
 qrcode: 'value is required. QR modules are vector shapes; size and quiet-zone margin affect scan reliability. Test the printed output with a scanner.'
};
export const pdfOnly = new Set([
	'page-break',
	'page-number',
	'page-footer',
	'page-header',
	'keep-together',
	'watermark'
]);
