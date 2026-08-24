import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { createServer } from 'vite';

import { COMPONENT_FAMILIES, COMPONENT_MARKERS } from '../tests/components/component-catalog.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const componentsRoot = fileURLToPath(new URL('../src/lib/bases/', import.meta.url));
const decoder = new TextDecoder();

const directoryFamilies = async (base) =>
	(await readdir(`${componentsRoot}${base}/components`, { withFileTypes: true }))
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name)
		.sort();

assert.equal(COMPONENT_FAMILIES.length, 24, 'the component contract must cover exactly 24 families');
assert.equal(new Set(COMPONENT_FAMILIES).size, 24, 'component contract family names must be unique');

for (const base of ['forme', 'takumi']) {
	assert.deepEqual(
		await directoryFamilies(base),
		[...COMPONENT_FAMILIES].sort(),
		`${base} component directories drifted from the explicit 24-family contract`
	);
}

const assertMarkers = (source, base) => {
	for (const family of COMPONENT_FAMILIES) {
		assert.ok(
			source.includes(COMPONENT_MARKERS[family]),
			`${base} fixture did not serialize the ${family} marker (${COMPONENT_MARKERS[family]})`
		);
	}
};

const assertPdf = (bytes, base) => {
	assert.ok(bytes instanceof Uint8Array, `${base} renderer must return Uint8Array`);
	assert.ok(bytes.byteLength > 5_000, `${base} PDF was unexpectedly small (${bytes.byteLength} bytes)`);
	assert.equal(decoder.decode(bytes.subarray(0, 5)), '%PDF-', `${base} output lacked PDF signature`);
};

const findNode = (node, predicate) => {
	if (predicate(node)) return node;
	for (const child of node?.children ?? []) {
		const match = findNode(child, predicate);
		if (match) return match;
	}
	return undefined;
};

const server = await createServer({
	root,
	server: { middlewareMode: true },
	appType: 'custom'
});

try {
	const [
		{ default: FormeKitchenSink },
		{ default: FormeParityRegressions },
		{ default: FormeUnsupportedImageSource },
		{ default: TakumiKitchenSink },
		forme,
		{ render: renderSvelte },
		{ renderTakumiDocument }
	] = await Promise.all([
		server.ssrLoadModule('/tests/components/forme-kitchen-sink.svelte'),
		server.ssrLoadModule('/tests/components/forme-parity-regressions.svelte'),
		server.ssrLoadModule('/tests/components/forme-unsupported-image-source.svelte'),
		server.ssrLoadModule('/tests/components/takumi-kitchen-sink.svelte'),
		server.ssrLoadModule('@formepdf/svelte'),
		server.ssrLoadModule('svelte/server'),
		server.ssrLoadModule('/src/lib/bases/takumi/lib/render-document.ts')
	]);

	const formeDocument = await forme.serialize(FormeKitchenSink);
	const formeSource = JSON.stringify(formeDocument);
	assert.equal(formeDocument.metadata.title, 'Component contract: Forme');
	assert.ok(formeDocument.children.length >= 1, 'Forme fixture must serialize at least one Page');
	assertMarkers(formeSource, 'Forme');

	const formeParityDocument = await forme.serialize(FormeParityRegressions);
	const formeParitySource = JSON.stringify(formeParityDocument);
	assert.match(formeParitySource, /Checklist spacing contract/);
	const checklistTextWrapper = findNode(
		formeParityDocument,
		(node) =>
			node?.kind?.type === 'View' &&
			node.children?.some(
				(child) => child?.kind?.type === 'Text' && child.kind.content === 'Checklist spacing contract'
			)
	);
	assert.equal(
		checklistTextWrapper?.style?.margin?.left,
		8,
		'Forme checklist text wrapper must retain upstream 8pt left spacing'
	);
	assert.match(
		formeParitySource,
		/data:image\/png;base64,iVBORw0KGgo/,
		'Forme image string source must survive serialization'
	);
	await assert.rejects(
		forme.serialize(FormeUnsupportedImageSource),
		/Forme Svelte renderer accepts only string URLs, file paths, or data URIs/,
		'Forme structured image sources must fail loudly instead of dropping request options'
	);

	const { body: takumiHtml } = renderSvelte(TakumiKitchenSink);
	assert.match(takumiHtml, /data-pdf-document="Component contract: Takumi"/);
	assert.match(takumiHtml, /data-pdf-page/);
	assertMarkers(takumiHtml, 'Takumi');

	const [formePdf, takumiPdf] = await Promise.all([
		forme.renderDocument(FormeKitchenSink),
		renderTakumiDocument(TakumiKitchenSink, { margin: 0, size: 'a4' })
	]);
	assertPdf(formePdf, 'Forme');
	assertPdf(takumiPdf, 'Takumi');

	const formePages = (new TextDecoder('latin1').decode(formePdf).match(/\/Type\s*\/Page\b/g) ?? [])
		.length;
	const takumiPages = (new TextDecoder('latin1').decode(takumiPdf).match(/\/Type\s*\/Page\b/g) ?? [])
		.length;
	assert.ok(formePages >= 2, `Forme PageBreak contract expected at least 2 pages, received ${formePages}`);
	assert.ok(takumiPages >= 2, `Takumi PageBreak contract expected at least 2 pages, received ${takumiPages}`);

	console.log(`Component contract: 24/24 families matched both renderer directories.`);
	console.log(
		`Forme: all 24 markers serialized; ${formePdf.byteLength} PDF bytes across ${formePages} pages.`
	);
	console.log(
		`Takumi: all 24 markers SSR-rendered; ${takumiPdf.byteLength} PDF bytes across ${takumiPages} pages.`
	);
} finally {
	await server.close();
}
