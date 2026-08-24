import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

import { createServer } from 'vite';

const root = fileURLToPath(new URL('..', import.meta.url));
const server = await createServer({
	root,
	server: { middlewareMode: true },
	appType: 'custom'
});

try {
	const [{ default: FormeDocument }, { default: TakumiDocument }, forme, svelteServer] = await Promise.all([
		server.ssrLoadModule('/tests/render/forme-document.svelte'),
		server.ssrLoadModule('/tests/render/takumi-document.svelte'),
		server.ssrLoadModule('@formepdf/svelte'),
		server.ssrLoadModule('svelte/server')
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

	const { body: html } = svelteServer.render(TakumiDocument);
	assert.match(html, /data-pdf-document="pdfcn-svelte Takumi smoke test"/);
	assert.equal((html.match(/data-pdf-page/g) ?? []).length, 2);
	assert.match(html, /height:1122\.52px/);
	assert.match(html, /width:793\.7066666666666px/);
	assert.match(html, /height:533\.3333333333333px/);
	assert.match(html, /width:400px/);
	assert.match(html, /Takumi renderer smoke test/);
	assert.match(html, /color:#334155/);
	assert.match(html, /font-family:Helvetica/);
	assert.match(html, /Quarterly activity/);
	assert.match(html, /<svg[^>]*width="320"[^>]*height="160"[^>]*viewBox="0 0 240 120"/);
	assert.match(html, /<rect/);
	assert.match(html, />Alpha</);
	assert.match(html, />Smoke page 1</);
	assert.match(html, />Smoke page 2</);
	assert.match(html, /Second page content/);

	console.log(`Forme: serialized one A4 page and rendered ${pdf.byteLength} PDF bytes.`);
	console.log('Takumi: SSR verified theme, page sizes, text, graph SVG, and two-page numbering.');
} finally {
	await server.close();
}
