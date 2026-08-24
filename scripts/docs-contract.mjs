import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { blockCatalog } from '../tests/render/block-catalog.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const buildDirectory = path.join(root, 'build');
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
	const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '');
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
	await assertBuiltPath(`/previews/forme/${slug}.pdf`);

	const pdf = await readFile(path.join(buildDirectory, 'previews', 'forme', `${slug}.pdf`));
	assert.ok(pdf.byteLength > 1_000, `${slug}: docs preview PDF is unexpectedly small`);
	assert.equal(pdf.subarray(0, 5).toString(), '%PDF-', `${slug}: docs preview is not a PDF`);
}

const htmlFiles = (await walk(buildDirectory)).filter((file) => file.endsWith('.html'));
assert.ok(htmlFiles.length >= 54, `expected at least 54 prerendered HTML pages, received ${htmlFiles.length}`);

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
	`Docs contract: ${htmlFiles.length} prerendered pages, 24 components, 10 live templates, 10 PDF previews, and internal links passed.`
);
