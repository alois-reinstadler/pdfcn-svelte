import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { blockCatalog } from '../tests/render/block-catalog.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const buildDirectory = path.join(root, 'build');
const configuredBase = process.env.PDFCN_BASE_PATH ?? '';
const componentSlugs = [
	'alert',
	'badge',
	'card',
	'data-table',
	'divider',
	'form',
	'graph',
	'heading',
	'keep-together',
	'key-value',
	'link',
	'list',
	'page-break',
	'page-footer',
	'page-header',
	'page-number',
	'pdf-image',
	'qrcode',
	'section',
	'signature',
	'stack',
	'table',
	'text',
	'watermark'
];
const renderers = ['forme', 'takumi'];
const themes = ['blueprint', 'corporate', 'elegant', 'executive', 'forest', 'minimal', 'modern', 'professional', 'vivid'];

assert.equal(new Set(componentSlugs).size, 24, 'docs contract must cover all 24 component families');
assert.equal(blockCatalog.length, 10, 'docs contract must cover all 10 document templates');

async function walk(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		const file = path.join(directory, entry.name);
		if (entry.isDirectory()) files.push(...await walk(file));
		else files.push(file);
	}
	return files;
}

async function assertBuiltPath(pathname) {
	const sitePath = configuredBase && pathname.startsWith(`${configuredBase}/`)
		? pathname.slice(configuredBase.length)
		: pathname === configuredBase
			? '/'
			: pathname;
	const relative = sitePath === '/' ? 'index.html' : sitePath.replace(/^\//, '');
	const candidates = path.extname(relative)
		? [relative]
		: [`${relative}.html`, path.join(relative, 'index.html'), relative];
	for (const candidate of candidates) {
		try {
			await access(path.join(buildDirectory, candidate));
			return;
		} catch {
			// Try the next static-adapter representation.
		}
	}
	assert.fail(`docs build is missing ${pathname}`);
}

const fixedRoutes = [
	'/',
	'/components',
	'/templates',
	'/docs',
	'/docs/getting-started',
	'/docs/install',
	'/docs/fonts',
	'/docs/parity',
	'/docs/primitives',
	'/docs/registry',
	'/docs/renderers',
	'/docs/themes'
];

for (const route of fixedRoutes) await assertBuiltPath(route);
for (const slug of componentSlugs) await assertBuiltPath(`/components/${slug}`);
for (const { slug } of blockCatalog) {
	await assertBuiltPath(`/templates/${slug}`);
	await assertBuiltPath(`/preview/takumi/${slug}`);
	for (const renderer of renderers) {
		for (const theme of themes) {
			const previewPath = `/previews/${renderer}/${theme}/${slug}.pdf`;
			await assertBuiltPath(previewPath);
				const pdf = await readFile(path.join(buildDirectory, previewPath));
				assert.ok(pdf.byteLength > 1_000, `${renderer}/${theme}/${slug}: preview PDF is unexpectedly small`);
				assert.equal(pdf.subarray(0, 5).toString(), '%PDF-', `${renderer}/${theme}/${slug}: preview is not a PDF`);
				if (renderer === 'forme') {
					const source = pdf.toString('latin1');
					assert.match(source, /\/BaseFont\s*\/Helvetica\b/, `${renderer}/${theme}/${slug}: preview did not use the sans-serif preview font`);
					assert.doesNotMatch(source, /\/BaseFont\s*\/(?:Times|Courier)/, `${renderer}/${theme}/${slug}: preview fell back to an unintended serif or monospace base font`);
				}
			}
	}
}

const htmlFiles = (await walk(buildDirectory)).filter((file) => file.endsWith('.html'));
assert.ok(htmlFiles.length >= 57, `expected at least 57 prerendered HTML pages, received ${htmlFiles.length}`);

for (const file of htmlFiles) {
	const html = await readFile(file, 'utf8');
	assert.doesNotMatch(html, /\[500\]|Internal Error/i, `${path.relative(buildDirectory, file)} contains an error page`);

	const relative = path.relative(buildDirectory, file).replaceAll(path.sep, '/');
	const route = relative === 'index.html' ? '/' : `/${relative.replace(/(?:\/index)?\.html$/, '')}`;
	for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
		const reference = match[1];
		if (/^(?:data:|https?:|mailto:|tel:|#)/.test(reference)) continue;
		const target = new URL(reference, `https://docs.local${route}`).pathname;
		await assertBuiltPath(target);
	}
}

console.log(
	`Docs contract: ${htmlFiles.length} prerendered pages, 24 components, 10 live templates, 180 renderer/theme PDF previews, and internal links passed.`
);
