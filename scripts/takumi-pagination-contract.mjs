import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { createCanvas } from '@napi-rs/canvas';
import { render as renderNative } from 'takumi-pdf';
const root = new URL('..', import.meta.url).pathname;
const artifactDir = process.env.PDFCN_PAGINATION_ARTIFACTS;
const server = await createServer({ root, optimizeDeps: { noDiscovery: true }, server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' });
try {
 const { renderDocument } = await server.ssrLoadModule('/src/lib/bases/takumi/server.ts');
 const { default: fixture } = await server.ssrLoadModule('/tests/render/takumi-pagination.svelte');
 await assert.rejects(() => renderDocument(fixture, { margin: 0 }), /define their own physical geometry/);
 for (const key of ['width', 'height', 'minHeight', 'maxHeight', 'padding', 'paddingTop', 'paddingHorizontal', 'paddingInline']) {
  await assert.rejects(() => renderDocument(fixture, { props: { scenario: 'flow-style', pageStyle: { [key]: 10 } } }), /Page flow cannot use style\./);
 }
 if (artifactDir) await mkdir(artifactDir, { recursive: true });
 const bandPositions = [];
 for (const bandExtra of [0, 40]) {
  const pdf = await renderDocument(fixture, { props: { scenario: 'band-centering', bandExtra } });
  const doc = await getDocument({ data: pdf.slice(), disableWorker: true }).promise;
  assert.ok(doc.numPages > 1);
  let firstPositions;
  for (let n = 1; n <= doc.numPages; n++) {
   const page = await doc.getPage(n); const { items } = await page.getTextContent();
   const labels = ['LEFT HEADER', 'RIGHT HEADER', 'LEFT FOOTER', 'RIGHT FOOTER'];
   const bandItems = labels.map(label => items.find(item => item.str === label));
   assert.ok(bandItems.every(Boolean), `all bands preserved on physical page ${n}`);
   for (const item of bandItems) {
    assert.ok(item.transform[4] >= 28.5, `${item.str}: left inset`);
    assert.ok(item.transform[4] + item.width <= 283.5, `${item.str}: right inset`);
   }
   assert.ok(Math.abs(bandItems[0].transform[4] - 29) < 0.5, 'header aligns with left margin');
   assert.ok(Math.abs(bandItems[2].transform[4] - 29) < 0.5, 'footer aligns with left margin');
   for (const item of items.filter(item => item.str.startsWith('BAND ROW'))) {
    assert.ok(item.transform[5] < 420 - (60 + bandExtra), 'body stays below reserved header');
    assert.ok(item.transform[5] > 50 + bandExtra, 'body stays above reserved footer');
   }
   for (const item of bandItems.slice(0, 2)) {
    assert.ok(item.transform[5] > 420 - (60 + bandExtra), 'header stays out of body');
    assert.ok(item.transform[5] + item.height < 420, 'header does not clip at physical top');
   }
   for (const item of bandItems.slice(2)) {
    assert.ok(item.transform[5] > 0, 'footer does not clip at physical bottom');
    assert.ok(item.transform[5] + item.height < 50 + bandExtra, 'footer stays out of body');
   }
   const positions = [bandItems[0].transform[5], bandItems[2].transform[5]];
   firstPositions ??= positions;
   assert.deepEqual(positions, firstPositions, 'bands stay aligned on every continuation page');
   assert.ok(positions[1] > (50 + bandExtra) / 4, 'footer remains safely above physical bottom edge');
   if (artifactDir && n === 2) {
    const viewport = page.getViewport({ scale: 2 }); const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
    await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
    await writeFile(`${artifactDir}/bands-${bandExtra}-page-${n}.png`, canvas.toBuffer('image/png'));
   }
  }
  bandPositions.push(firstPositions);
  await doc.destroy();
 }
 // Takumi quantizes CSS geometry to whole pixels (0.75pt); allow one pixel.
 assert.ok(Math.abs(bandPositions[0][0] - bandPositions[1][0] - 20) <= 0.75, '40pt more top margin moves the header center by 20pt');
 assert.ok(Math.abs(bandPositions[1][1] - bandPositions[0][1] - 20) <= 0.75, '40pt more bottom margin moves the footer center by 20pt');
 const nativeOptions = { size: { width: 400, height: 400 }, margin: { top: 80, bottom: 60, left: 50, right: 30 }, header: '<div>NATIVE HEADER</div>', footer: '<div>NATIVE FOOTER</div>' };
 const nativePositions = [];
 for (const pdf of [await renderDocument(fixture, { props: { scenario: 'native-band' }, ...nativeOptions }), await renderNative('<div>NATIVE BODY</div>', nativeOptions)]) {
  const doc = await getDocument({ data: pdf.slice(), disableWorker: true }).promise;
  const { items } = await (await doc.getPage(1)).getTextContent();
  nativePositions.push(items.filter(item => /NATIVE HEADER|NATIVE FOOTER/.test(item.str)).map(item => [item.transform[4], item.transform[5]]));
  await doc.destroy();
 }
 assert.deepEqual(nativePositions[0], nativePositions[1], 'raw renderer bands retain native coordinates');
 console.log('repeated component bands respect asymmetric margins and vertical centers; native bands unchanged');
 const gapPositions = [];
 for (const scenario of ['gap-plain', 'gap']) {
  const pdf = await renderDocument(fixture, { props: { scenario } });
  const doc = await getDocument({ data: pdf.slice(), disableWorker: true }).promise;
  assert.equal(doc.numPages, 1);
  const { items } = await (await doc.getPage(1)).getTextContent();
  if (artifactDir) {
   const page = await doc.getPage(1); const viewport = page.getViewport({ scale: 2 });
   const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
   await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
   await writeFile(`${artifactDir}/${scenario}.png`, canvas.toBuffer('image/png'));
  }
  gapPositions.push(items.filter(item => /GAP HEADING|NEXT GAP CONTENT/.test(item.str)).map(item => item.transform[5]));
  await doc.destroy();
 }
 assert.deepEqual(gapPositions[0], gapPositions[1], 'keepWithNext must preserve parent gap and text baselines');
 assert.ok(gapPositions[1][0] - gapPositions[1][1] > 30, '20pt gap must remain visible');
 console.log('flow styles rejected; parent gap and text baselines preserved');
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
   assert.ok(header.transform[4] >= 32.5 && footer.transform[4] >= 32.5, `${scenario}: bands respect 33pt left margin`);
   assert.ok(header.transform[4] + header.width <= page.view[2] - 23.5, `${scenario}: header respects 24pt right margin`);
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
 for (const [scenario, error] of [['overflow', /overflows a fixed-size Page/], ['oversized', /unbreakable component/], ['mixed', /same size/], ['small-band', /header needs/], ['narrow-band', /footer needs/], ['fixed', /View fixed is unsupported/], ['image', /has no bytes/], ['corrupt-image', /could not decode an image/], ['watermark', /authored fixed-size Page/], ['bad-header', /rightText/], ['bad-footer', /centerText/], ['negative', /finite non-negative/], ['flex-width', /explicit column width/], ['percentage-width', /taller than the printable page/]]) {
  await assert.rejects(() => renderDocument(fixture, { props: { scenario } }), error);
  console.log(`${scenario}: actionable error`);
 }
} finally { await server.close(); }
