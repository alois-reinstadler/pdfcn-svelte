import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { createCanvas } from '@napi-rs/canvas';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { blockCatalog } from '../tests/render/block-catalog.mjs';
import { inspectPdf } from '../tests/render/pdf-inspection.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const artifactDir = process.env.PDFCN_REGRESSION_ARTIFACTS;
const server = await createServer({ root, optimizeDeps: { noDiscovery: true }, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const common = {
 invoiceNumber: 'CUSTOM-2026', invoiceDate: '2026-09-21', dueDate: '2026-10-21',
 companyName: 'Custom Company', subtitle: 'Consulting', companyAddress: 'Vienna', companyEmail: 'company@example.test',
 billTo: { name: 'Customer', address: 'Vienna', email: 'customer@example.test', phone: '+43 123' },
 consultant: { name: 'Consultant', title: 'Engineering', email: 'consultant@example.test' },
 client: { name: 'Customer', company: 'Client', address: 'Vienna', email: 'customer@example.test' },
 paymentTerms: { dueDate: '2026-10-21', method: 'Bank transfer', gst: 'VAT ID ATU000000' }, notes: 'CUSTOMFOOTER',
 summary: { subtotal: 300, tax: 60, total: 360, totalHours: 40 }
};

async function inspectLayout(pdf, label, expectedMarkers) {
 const doc = await getDocument({ data: pdf.slice(), disableWorker: true, standardFontDataUrl: `${root}/node_modules/pdfjs-dist/standard_fonts/` }).promise;
 try {
  for (let n = 1; n <= doc.numPages; n++) {
   const page = await doc.getPage(n);
   const { items } = await page.getTextContent();
   const footer = items.find(item => item.str.includes('CUSTOMFOOTER'));
   if (footer) for (const item of items.filter(item => expectedMarkers.some(marker => item.str.includes(marker)))) {
    assert.ok(item.transform[5] > footer.transform[5] + 10, `${label}: row overlaps footer on page ${n}`);
   }
   if (artifactDir && label.includes('invoice-modern') && label.includes('wrapped')) {
    const viewport = page.getViewport({ scale: 1 });
    const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
    await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
    await writeFile(`${artifactDir}/${label}-${n}.png`, canvas.toBuffer('image/png'));
   }
  }
 } finally { await doc.destroy(); }
}

try {
 if (artifactDir) await mkdir(artifactDir, { recursive: true });
 const forme = await server.ssrLoadModule('@formepdf/svelte');
 const takumi = await server.ssrLoadModule('/src/lib/bases/takumi/server.ts');
 for (const renderer of ['forme', 'takumi']) {
  const render = renderer === 'forme' ? forme.renderDocument : takumi.renderDocument;
  for (const { slug } of blockCatalog.filter(block => block.slug.startsWith('invoice-'))) {
   const { default: component } = await server.ssrLoadModule(`/src/lib/bases/${renderer}/blocks/${slug}/${slug}.svelte`);
   for (const scenario of ['short', 'long', 'wrapped']) {
    const count = scenario === 'short' ? 3 : scenario === 'long' ? 40 : 23;
    const markers = Array.from({ length: count }, (_, i) => `ITEM${String(i + 1).padStart(3, '0')}`);
    const items = markers.map((marker, i) => ({ description: `${marker}${scenario === 'wrapped' && i % 3 === 0 ? ' Detailed implementation and testing of customer requirements with documentation and quality review.'.repeat(2) : ''}`, quantity: 1, unitPrice: 100 }));
    const data = { ...common, items, services: items.map(item => ({ description: item.description, hours: 1, rate: 100 })), ...(scenario === 'wrapped' ? { currency: 'EUR', locale: 'de-AT', taxLabel: 'VAT supplied' } : {}) };
    const pdf = await render(component, { props: { data }, ...(renderer === 'takumi' ? { margin: 0 } : {}) });
    const label = `${renderer}-${slug}-${scenario}`;
    const inspected = await inspectPdf(pdf);
    for (const marker of markers) assert.equal(inspected.text.split(marker).length - 1, 1, `${label}: ${marker} must occur exactly once`);
    assert.match(inspected.text, scenario === 'wrapped' ? /€\s*360,00/ : /\$360\.00/, `${label}: supplied total must survive`);
    assert.doesNotMatch(inspected.text, /Tax\s*\(\d/, `${label}: invented tax percentage`);
    if (scenario === 'wrapped') assert.match(inspected.text, /VAT supplied/);
    inspected.pageTexts.forEach((text, i) => assert.ok(text.includes(`Page ${i + 1} of ${inspected.pages}`), `${label}: wrong footer on page ${i + 1}`));
    if (scenario !== 'short') assert.ok(inspected.pages > 1, `${label}: long content must paginate`);
    await inspectLayout(pdf, label, markers);
    if (artifactDir) await writeFile(`${artifactDir}/${label}.pdf`, pdf);
    console.log(`${label}: ${count} rows, ${inspected.pages} pages, complete totals and page labels`);
   }
  }
  for (const { slug } of blockCatalog.filter(block => block.slug.startsWith('report-'))) {
   const { default: component } = await server.ssrLoadModule(`/src/lib/bases/${renderer}/blocks/${slug}/${slug}.svelte`);
   const data = { title: 'Caller report', subtitle: 'Custom', generatedAt: '2026-09-21', period: 'September', author: 'Caller', summary: [{ label: 'Findings', value: '0' }], highlights: ['All checks complete'], rows: [{ label: 'Remediation', owner: 'Caller', progress: 100, status: 'Complete', risk: 'Low' }], series: [{ label: 'CUSTOM', value: 0 }], status: { label: 'CALLER ALL CLEAR', tone: 'success' } };
   for (const withStatus of [true, false]) {
    const pdf = await render(component, { props: { data: { ...data, series: [{ label: 'CUSTOM', value: withStatus ? 7 : 0 }], status: withStatus ? data.status : undefined } }, ...(renderer === 'takumi' ? { margin: 0 } : {}) });
    const inspected = await inspectPdf(pdf);
    assert.match(inspected.text, withStatus ? /CALLER ALL CLEAR/ : /Status not supplied/);
    assert.doesNotMatch(inspected.text, /Action Needed|Finance: Healthy|Growth: Strong|High Risk|Medium Risk/);
    if (slug === 'report-security' && withStatus) assert.match(inspected.text, /CUSTOM/);
    inspected.pageTexts.forEach((text, i) => assert.ok(text.includes(`Page ${i + 1} of ${inspected.pages}`), `${renderer}-${slug}: wrong page label`));
   }
   console.log(`${renderer}-${slug}: caller status, neutral fallback, chart input and page labels verified`);
  }
 }
} finally { await server.close(); }
