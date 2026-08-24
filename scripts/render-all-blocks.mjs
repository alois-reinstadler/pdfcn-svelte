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
const previewDirectory = fileURLToPath(new URL('../public/previews/', import.meta.url));
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

	const [forme, svelteServer, takumiAdapter, themesModule, showcaseModule, previewThemeModule] = await Promise.all([
		runForme ? server.ssrLoadModule('@formepdf/svelte') : undefined,
		runTakumi ? server.ssrLoadModule('svelte/server') : undefined,
		runTakumi ? server.ssrLoadModule('/src/lib/bases/takumi/lib/render-document.ts') : undefined,
		writePreviews ? server.ssrLoadModule('/src/lib/themes/index.ts') : undefined,
		writePreviews ? server.ssrLoadModule('/src/docs/template-showcase.ts') : undefined,
		writePreviews ? server.ssrLoadModule('/src/docs/pdf-preview-theme.ts') : undefined
	]);

	const previewThemes = writePreviews
		? Object.entries(themesModule.themePresets)
		: [['default', undefined]];
	const defaultThemes = new Map(
		(showcaseModule?.documentTemplates ?? []).map((template) => [template.slug, template.theme])
	);

	if (writePreviews) await mkdir(previewDirectory, { recursive: true });

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


			for (const [themeName, theme] of previewThemes) {
				const previewTheme = theme
					? previewThemeModule.createPdfPreviewTheme(theme, 'forme')
					: undefined;
				const pdf = await forme.renderDocument(
					component,
					previewTheme ? { props: { theme: previewTheme } } : undefined
				);
				const label = `forme/${themeName}/${block.slug}`;
				assertPdf(pdf, label);
				const renderedPages = countPdfPages(pdf);
				assert.equal(renderedPages, block.expectedPages, `${label}: unexpected rendered page count`);

				if (writePreviews) {
					const directory = `${previewDirectory}forme/${themeName}/`;
					await mkdir(directory, { recursive: true });
					await writeFile(`${directory}${block.slug}.pdf`, pdf);
					if (defaultThemes.get(block.slug) === themeName) {
						await mkdir(`${previewDirectory}forme/`, { recursive: true });
						await writeFile(`${previewDirectory}forme/${block.slug}.pdf`, pdf);
					}
				}

				results.push({
					renderer: 'forme',
					theme: themeName,
					slug: block.slug,
					bytes: pdf.byteLength,
					pages: renderedPages,
					preview: writePreviews ? `public/previews/forme/${themeName}/${block.slug}.pdf` : undefined
				});
			}
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

			for (const [themeName, theme] of previewThemes) {
				const previewTheme = theme
					? previewThemeModule.createPdfPreviewTheme(theme, 'takumi')
					: undefined;
				const pdf = await takumiAdapter.renderTakumiDocument(component, {
					margin: 0,
					...(previewTheme ? { props: { theme: previewTheme } } : {})
				});
				const label = `takumi/${themeName}/${block.slug}`;
				assertPdf(pdf, label);
				const renderedPages = countPdfPages(pdf);
				assert.equal(renderedPages, block.expectedPages, `${label}: unexpected rendered page count`);

				if (writePreviews) {
					const directory = `${previewDirectory}takumi/${themeName}/`;
					await mkdir(directory, { recursive: true });
					await writeFile(`${directory}${block.slug}.pdf`, pdf);
					if (defaultThemes.get(block.slug) === themeName) {
						await mkdir(`${previewDirectory}takumi/`, { recursive: true });
						await writeFile(`${previewDirectory}takumi/${block.slug}.pdf`, pdf);
					}
				}

				results.push({ renderer: 'takumi', theme: themeName, slug: block.slug, bytes: pdf.byteLength, pages: renderedPages });
			}
		}
	}
} finally {
	await server.close();
}

if (jsonOutput) {
	console.log(JSON.stringify(results, null, 2));
} else {
	if (writePreviews) {
		console.table(['forme', 'takumi']
			.filter((renderer) => results.some((result) => result.renderer === renderer))
			.map((renderer) => {
				const rendererResults = results.filter((result) => result.renderer === renderer);
				return {
					renderer,
					previews: rendererResults.length,
					bytes: rendererResults.reduce((total, result) => total + result.bytes, 0)
				};
			}));
	} else {
		console.table(results.map(({ renderer, theme, slug, bytes, pages }) => ({ renderer, theme, slug, bytes, pages })));
	}
	const previewMessage = writePreviews ? ' Browser-native PDF previews were refreshed.' : '';
	console.log(`Rendered ${results.length} block contracts successfully.${previewMessage}`);
}
