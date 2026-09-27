import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { createCanvas } from '@napi-rs/canvas';
const root = new URL('..', import.meta.url).pathname;
const artifactDir = process.env.PDFCN_PAGINATION_ARTIFACTS;
const server = await createServer({ root, optimizeDeps: { noDiscovery: true }, server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' });
try {
 const { renderDocument } = await server.ssrLoadModule('/src/lib/bases/takumi/server.ts');
 const { default: fixture } = await server.ssrLoadModule('/tests/render/takumi-pagination.svelte');
 await assert.rejects(() => renderDocument(fixture, { margin: 0 }), /define their own physical geometry/);
 if (artifactDir) await mkdir(artifactDir, { recursive: true });
 for (const scenario of ['flow', 'keep', 'ahead', 'landscape']) {
  const pdf = await renderDocument(fixture, { props: { scenario } });
  const doc = await getDocument({ data: pdf.slice(), disableWorker: true }).promise;
  const texts = [];
  for (let i = 1; i <= doc.numPages; i++) {
   const page = await doc.getPage(i); const content = await page.getTextContent();
   const text = content.items.map(item => item.str).join(' '); texts.push(text);
   assert.match(text, /REPEATED HEADER/, `${scenario} page ${i} header`);
   assert.match(text, /FOOTER ONE/, `${scenario} page ${i} stacked footer`);
   assert.ok(text.replace(/\s+/g, "").includes(`PHYSICAL${i}/${doc.numPages}`), `${scenario} page ${i}: ${text}`);
   const header = content.items.find(item => item.str.includes('REPEATED'));
   const footer = content.items.find(item => item.str.includes('FOOTER ONE'));
   for (const item of content.items.filter(item => /ROW-|NEXT CONTENT|KEPT HEADING|MINIMUM GROUP/.test(item.str))) {
    assert.ok(item.transform[5] < header.transform[5] - 12, `${scenario}: body overlaps header`);
    assert.ok(item.transform[5] > footer.transform[5] + 12, `${scenario}: body overlaps footer`);
   }
   if (scenario === 'landscape') assert.ok(page.view[2] > page.view[3]);
   if (artifactDir) {
    const viewport = page.getViewport({ scale: 2 }); const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
    await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
    await writeFile(`${artifactDir}/${scenario}-${i}.png`, canvas.toBuffer('image/png'));
   }
  }
  if (scenario === 'flow' || scenario === 'landscape') for (let n = 0; n < 32; n++) assert.equal(texts.join(' ').split(`ROW-${String(n).padStart(3, '0')}`).length - 1, 1);
  if (scenario === 'flow') assert.match(texts.at(-1), /AUTHORED SECOND SECTION/);
  if (scenario === 'keep' || scenario === 'ahead') {
   assert.equal(texts.length, 2, `${scenario}: group moved to second page`);
   assert.match(texts[1], scenario === 'keep' ? /KEPT HEADING.*NEXT CONTENT/ : /MINIMUM GROUP.*NEXT CONTENT/);
  }
  console.log(`${scenario}: ${doc.numPages} physical pages, preserved body and numbered bands`);
  await doc.destroy();
 }
 for (const [scenario, error] of [['overflow', /overflows a fixed-size Page/], ['oversized', /unbreakable component/], ['mixed', /same size/], ['small-band', /header needs/], ['fixed', /View fixed is unsupported/], ['image', /has no bytes/], ['corrupt-image', /could not decode an image/], ['watermark', /authored fixed-size Page/], ['bad-header', /rightText/], ['bad-footer', /centerText/], ['negative', /finite non-negative/]]) {
  await assert.rejects(() => renderDocument(fixture, { props: { scenario } }), error);
  console.log(`${scenario}: actionable error`);
 }
} finally { await server.close(); }
