import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

import { createServer } from 'vite';

import { inspectPdf } from '../tests/render/pdf-inspection.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const server = await createServer({
	root,
	optimizeDeps: { noDiscovery: true },
	server: { middlewareMode: true },
	appType: 'custom'
});

try {
	const [
		{ default: FormeDocument },
		{ default: TakumiDocument },
		{ default: TakumiOverflowDocument },
		forme,
		svelteServer,
		takumiAdapter
	] = await Promise.all([
		server.ssrLoadModule('/tests/render/forme-document.svelte'),
		server.ssrLoadModule('/tests/render/takumi-document.svelte'),
		server.ssrLoadModule('/tests/render/takumi-overflow-document.svelte'),
		server.ssrLoadModule('@formepdf/svelte'),
		server.ssrLoadModule('svelte/server'),
		server.ssrLoadModule('/src/lib/bases/takumi/lib/render-document.ts')
	]);

	const serialized = await forme.serialize(FormeDocument);
	assert.equal(serialized.metadata.title, 'pdfcn-svelte Forme smoke test');
	assert.equal(serialized.metadata.author, 'pdfcn-svelte');
	assert.equal(serialized.children.length, 1);

	const formePage = serialized.children[0];
	assert.equal(formePage.kind.type, 'Page');
	assert.equal(formePage.kind.config.size, 'A4');
	assert.deepEqual(formePage.kind.config.margin, { top: 36, right: 36, bottom: 36, left: 36 });
	assert.match(JSON.stringify(formePage), /Forme renderer smoke test/);
	assert.deepEqual(formePage.children[0].children[0].style.color, {
		r: 51 / 255,
		g: 65 / 255,
		b: 85 / 255,
		a: 1
	});

	const pdf = await forme.renderDocument(FormeDocument);
	assert.ok(pdf instanceof Uint8Array);
	assert.ok(pdf.byteLength > 1_000, `expected a non-trivial PDF, received ${pdf.byteLength} bytes`);
	assert.equal(new TextDecoder().decode(pdf.subarray(0, 5)), '%PDF-');
	const formeInspection = await inspectPdf(pdf);
	assert.match(formeInspection.text, /Forme renderer smoke test/);
	assert.ok(formeInspection.baseFonts.length > 0, 'expected the Forme PDF to embed a font');

	const { body: html } = svelteServer.render(TakumiDocument);
	assert.match(html, /data-pdf-document="pdfcn-svelte Takumi smoke test"/);
	assert.equal((html.match(/data-pdf-page/g) ?? []).length, 2);
	assert.match(html, /height:1121\.9866666666667px/);
	assert.match(html, /width:793\.1733333333333px/);
	assert.match(html, /height:532\.8px/);
	assert.match(html, /width:399\.4666666666667px/);
	assert.match(html, /Takumi renderer smoke test/);
	assert.match(html, /color:#334155/);
	assert.match(html, /font-family:Helvetica/);
	assert.match(html, /Quarterly activity/);
	assert.match(html, /<svg[^>]*width="320"[^>]*height="160"[^>]*viewBox="0 0 240 120"/);
	assert.match(html, /<rect/);
	assert.match(html, />Alpha</);
	assert.match(html, /class="pageNumber">1<\/span>/);
	assert.match(html, /class="pageNumber">2<\/span>/);
	assert.match(html, /class="totalPages">1<\/span>/);
	assert.match(html, /Second page content/);

	const takumiPdf = await takumiAdapter.renderTakumiDocument(TakumiDocument, {
		margin: 0,
		size: 'a4'
	});
	assert.ok(takumiPdf instanceof Uint8Array);
	assert.ok(
		takumiPdf.byteLength > 1_000,
		`expected a non-trivial Takumi PDF, received ${takumiPdf.byteLength} bytes`
	);
	assert.equal(new TextDecoder().decode(takumiPdf.subarray(0, 5)), '%PDF-');
	const takumiInspection = await inspectPdf(takumiPdf);
	assert.match(takumiInspection.text, /Takumi renderer smoke test/);
	assert.match(takumiInspection.text, /Second page content/);
	assert.ok(takumiInspection.baseFonts.length > 0, 'expected the Takumi PDF to embed a font');

	const overflowPdf = await takumiAdapter.renderTakumiDocument(TakumiOverflowDocument, {
		margin: 20,
		props: { lineCount: 60 },
		size: { width: 300, height: 300 }
	});
	const overflowPdfSource = new TextDecoder('latin1').decode(overflowPdf);
	const overflowPages = (overflowPdfSource.match(/\/Type\s*\/Page\b/g) ?? []).length;
	assert.ok(overflowPages > 1, `expected overflow pagination, received ${overflowPages} page`);
	const overflowInspection = await inspectPdf(overflowPdf);
	assert.match(overflowInspection.text, /Overflow row 1/);
	assert.match(overflowInspection.text, /Overflow row 60/);

	console.log(`Forme: serialized one A4 page and rendered ${pdf.byteLength} PDF bytes.`);
	console.log(
		`Takumi: rendered ${takumiPdf.byteLength} PDF bytes and overflowed content across ${overflowPages} pages.`
	);
} finally {
	await server.close();
}
