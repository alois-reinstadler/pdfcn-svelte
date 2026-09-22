import assert from 'node:assert/strict';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { inspectPdf } from '../tests/render/pdf-inspection.mjs';
const server = await createServer({
	server: { middlewareMode: true },
	appType: 'custom',
	optimizeDeps: { noDiscovery: true }
});
try {
	const forme = await server.ssrLoadModule('@formepdf/svelte');
	const takumi = await server.ssrLoadModule('/src/lib/bases/takumi/server.ts');
	let count = 0;
	for (const base of ['forme', 'takumi']) {
		for (const folder of ['examples', 'template-examples']) {
			const files = (await readdir(`src/docs/${folder}/${base}`))
				.filter((f) => f.endsWith('.svelte'))
				.sort();
			assert.equal(files.length, folder === 'examples' ? 24 : 10);
			for (const file of files) {
				const { default: Component } = await server.ssrLoadModule(
					`/src/docs/${folder}/${base}/${file}`
				);
				const bytes = await (base === 'forme'
					? forme.renderDocument(Component)
					: takumi.renderDocument(Component));
				const pdf = await inspectPdf(bytes);
				assert.ok(
					pdf.pages >= 1 && pdf.text.trim().length > 0,
					`${base}/${file} must render readable PDF content`
				);
				if (file === 'page-number.svelte') {
					assert.equal(
						pdf.pages,
						2,
						`${base} page-number example must demonstrate two pages`
					);
					assert.match(pdf.pageTexts[0], /Page 1 of 2/);
					assert.match(pdf.pageTexts[1], /Page 2 of 2/);
				}
				if (folder === 'template-examples')
					assert.match(
						pdf.text,
						file.startsWith('invoice-') ? /INV-2026-01/ : /September review/
					);
				const out = `public/previews/${folder === 'examples' ? 'components' : 'custom'}/${base}`;
				await mkdir(out, { recursive: true });
				await writeFile(`${out}/${file.replace('.svelte', '.pdf')}`, bytes);
				count++;
			}
		}
	}
	console.log(
		`Documentation examples: ${count} actual shown files rendered; page numbers verified in both bases.`
	);
} finally {
	await server.close();
}
