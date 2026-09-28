import assert from 'node:assert/strict';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { inspectPdf } from '../tests/render/pdf-inspection.mjs';
const server = await createServer({
	server: { middlewareMode: true, hmr: false },
	appType: 'custom',
	optimizeDeps: { noDiscovery: true }
});
try {
	const forme = await server.ssrLoadModule('/src/lib/bases/forme/server.ts');
	const takumi = await server.ssrLoadModule('/src/lib/bases/takumi/server.ts');
	let count = 0;
	for (const base of ['forme', 'takumi']) {
		for (const folder of ['examples', 'template-examples', 'pagination-examples']) {
			const files = (await readdir(`src/docs/${folder}/${base}`))
				.filter((f) => f.endsWith('.svelte'))
				.sort();
			assert.equal(files.length, folder === 'examples' ? 24 : folder === 'template-examples' ? 10 : 1);
			for (const file of files) {
				const { default: Component } = await server.ssrLoadModule(
					`/src/docs/${folder}/${base}/${file}`
				);
				const bytes = await (base === 'forme'
					? forme.renderDocument(Component)
					: takumi.renderDocument(Component)).catch(error => { throw new Error(`${folder}/${base}/${file}: ${error.message}`, { cause: error }); });
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
				if (folder === 'examples' && ['page-header.svelte', 'page-footer.svelte', 'keep-together.svelte'].includes(file)) {
					assert.equal(pdf.pages, 2, `${base}/${file}: demonstrate two physical pages`);
					if (file === 'keep-together.svelte') {
						assert.doesNotMatch(pdf.pageTexts[0], /Approval/);
						assert.match(pdf.pageTexts[1], /Approval.*short section/);
					} else for (const text of pdf.pageTexts) assert.match(text, /Acme Studio/, `${base}/${file}: band must repeat`);
				}
				if (folder === 'template-examples')
					assert.match(
						pdf.text,
						file.startsWith('invoice-') ? /INV-2026-01/ : /September review/
					);
				if (folder === 'pagination-examples') {
					assert.ok(pdf.pages > 1, `${base}: the long invoice must demonstrate continuation pages`);
					for (let row = 1; row <= 40; row++) assert.equal(pdf.text.split(`Service ${String(row).padStart(2, '0')}`).length - 1, 1);
					pdf.pageTexts.forEach((text, index) => assert.ok(text.includes(`Page ${index + 1} of ${pdf.pages}`)));
					assert.match(pdf.pageTexts.at(-1), /7[.\s]?200,00/);
				}
				const out = `public/previews/${folder === 'examples' ? 'components' : folder === 'template-examples' ? 'custom' : 'pagination'}/${base}`;
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
