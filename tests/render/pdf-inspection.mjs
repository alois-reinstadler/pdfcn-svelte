import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { fileURLToPath } from 'node:url';

const standardFontDataUrl = fileURLToPath(
	new URL('../../node_modules/pdfjs-dist/standard_fonts/', import.meta.url)
);

/** Inspect the user-visible text and embedded font resources in a PDF. */
export async function inspectPdf(pdf) {
	const source = new TextDecoder('latin1').decode(pdf);
	const document = await getDocument({
		data: pdf.slice(),
		disableWorker: true,
		standardFontDataUrl
	}).promise;
	const pageTexts = [];

	try {
		for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
			const page = await document.getPage(pageNumber);
			const content = await page.getTextContent();
			pageTexts.push(content.items.map((item) => item.str).join(' ').replace(/\s+/g, ' ').trim());
		}

		return {
			baseFonts: [...source.matchAll(/\/BaseFont\s*\/([^\s/]+)/g)].map((match) => match[1]),
			pages: document.numPages,
			pageTexts,
			text: pageTexts.join(' ').replace(/\s+/g, ' ').trim()
		};
	} finally {
		await document.destroy();
	}
}
