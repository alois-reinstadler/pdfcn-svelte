import assert from 'node:assert/strict';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { createServer } from 'vite';

import { blockCatalog, blockComponentPath } from '../tests/render/block-catalog.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const args = new Set(process.argv.slice(2));
const writePreviews = args.has('--write-previews');
const jsonOutput = args.has('--json');
const formeOnly = args.has('--forme-only');
const takumiOnly = args.has('--takumi-only');

assert.ok(!(formeOnly && takumiOnly), '--forme-only and --takumi-only are mutually exclusive');

const runForme = !takumiOnly;
const runTakumi = !formeOnly;
const previewDirectory = fileURLToPath(new URL('../public/previews/forme/', import.meta.url));
const decoder = new TextDecoder();
const latin1Decoder = new TextDecoder('latin1');

async function assertCompleteCatalog(renderer) {
	const blocksDirectory = fileURLToPath(new URL(`../src/lib/bases/${renderer}/blocks/`, import.meta.url));
	const entries = await readdir(blocksDirectory, { withFileTypes: true });
	const actual = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
	const expected = blockCatalog.map((block) => block.slug).sort();
	assert.deepEqual(actual, expected, `${renderer}: render catalog does not match the block directories`);
}

function assertPdf(pdf, label) {
	assert.ok(pdf instanceof Uint8Array, `${label}: expected Uint8Array output`);
	assert.ok(pdf.byteLength > 1_000, `${label}: expected a non-trivial PDF, received ${pdf.byteLength} bytes`);
	assert.equal(decoder.decode(pdf.subarray(0, 5)), '%PDF-', `${label}: missing PDF signature`);
}

function countPdfPages(pdf) {
	return (latin1Decoder.decode(pdf).match(/\/Type\s*\/Page\b/g) ?? []).length;
}

function countTakumiSourcePages(html) {
	return (html.match(/data-pdf-page(?:=|\s|>)/g) ?? []).length;
}

function decodeHtmlText(html) {
	return html
		.replaceAll('&amp;', '&')
		.replaceAll('&lt;', '<')
		.replaceAll('&gt;', '>')
		.replaceAll('&quot;', '"')
		.replaceAll('&#39;', "'");
}

const server = await createServer({
	root,
	server: { middlewareMode: true },
	appType: 'custom',
	logLevel: 'error'
});

const results = [];

try {
	if (runForme) await assertCompleteCatalog('forme');
	if (runTakumi) await assertCompleteCatalog('takumi');

	const [forme, svelteServer, takumiAdapter] = await Promise.all([
		runForme ? server.ssrLoadModule('@formepdf/svelte') : undefined,
		runTakumi ? server.ssrLoadModule('svelte/server') : undefined,
		runTakumi ? server.ssrLoadModule('/src/lib/bases/takumi/lib/render-document.ts') : undefined
	]);

	if (writePreviews && runForme) await mkdir(previewDirectory, { recursive: true });

	for (const block of blockCatalog) {
		if (runForme) {
			const { default: component } = await server.ssrLoadModule(blockComponentPath('forme', block.slug));
			const serialized = await forme.serialize(component);
			const serializedText = JSON.stringify(serialized);

			assert.match(
				serializedText,
				new RegExp(block.identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
				`forme/${block.slug}: serialized tree is missing identifying content`
			);
			assert.equal(
				serialized.children.length,
				block.expectedPages,
				`forme/${block.slug}: unexpected source page count`
			);

			const pdf = await forme.renderDocument(component);
			assertPdf(pdf, `forme/${block.slug}`);
			const renderedPages = countPdfPages(pdf);
			assert.equal(renderedPages, block.expectedPages, `forme/${block.slug}: unexpected rendered page count`);

			if (writePreviews) {
				await writeFile(`${previewDirectory}${block.slug}.pdf`, pdf);
			}

			results.push({
				renderer: 'forme',
				slug: block.slug,
				bytes: pdf.byteLength,
				pages: renderedPages,
				preview: writePreviews ? `public/previews/forme/${block.slug}.pdf` : undefined
			});
		}

		if (runTakumi) {
			const { default: component } = await server.ssrLoadModule(blockComponentPath('takumi', block.slug));
			const { body: html } = svelteServer.render(component);
			const decodedHtml = decodeHtmlText(html);
			assert.match(
				decodedHtml,
				new RegExp(block.identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
				`takumi/${block.slug}: SSR output is missing identifying content`
			);
			assert.equal(
				countTakumiSourcePages(html),
				block.expectedPages,
				`takumi/${block.slug}: unexpected source page count`
			);

			const pdf = await takumiAdapter.renderTakumiDocument(component, { margin: 0 });
			assertPdf(pdf, `takumi/${block.slug}`);
			const renderedPages = countPdfPages(pdf);
			assert.equal(
				renderedPages,
				block.expectedPages,
				`takumi/${block.slug}: unexpected rendered page count`
			);

			results.push({ renderer: 'takumi', slug: block.slug, bytes: pdf.byteLength, pages: renderedPages });
		}
	}
} finally {
	await server.close();
}

if (jsonOutput) {
	console.log(JSON.stringify(results, null, 2));
} else {
	console.table(results.map(({ renderer, slug, bytes, pages }) => ({ renderer, slug, bytes, pages })));
	const previewMessage = writePreviews && runForme ? ' Canonical Forme previews were refreshed.' : '';
	console.log(`Rendered ${results.length} block contracts successfully.${previewMessage}`);
}
