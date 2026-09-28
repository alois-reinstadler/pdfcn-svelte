// Build readable images of physical PDF pages. This uses the PDF bytes already
// produced from displayed source, never HTML screenshots or simulated breaks.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const manifest = {};
for (const category of ['components', 'custom', 'pagination']) {
 for (const renderer of ['forme', 'takumi']) {
  const directory = `public/previews/${category}/${renderer}`;
  for (const file of (await readdir(directory)).filter(file => file.endsWith('.pdf')).sort()) {
   const bytes = new Uint8Array(await readFile(`${directory}/${file}`));
   const pdf = await getDocument({ data: bytes.slice(), disableWorker: true, standardFontDataUrl: `${resolve('node_modules/pdfjs-dist/standard_fonts')}/` }).promise;
   const slug = file.slice(0, -4);
   const path = `/previews/pages/${category}/${renderer}/${slug}`;
   const pages = [];
   await rm(`public${path}`, { recursive: true, force: true });
   await mkdir(`public${path}`, { recursive: true });
   try {
    for (let number = 1; number <= pdf.numPages; number++) {
     const page = await pdf.getPage(number);
     const viewport = page.getViewport({ scale: 1.6 });
     const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
     await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
     const text = (await page.getTextContent()).items.map(item => item.str ?? '').join(' ');
     assert.ok(text.trim().length, `${category}/${renderer}/${slug}: blank physical page ${number}`);
     const image = `${path}/${number}.webp`;
     await writeFile(`public${image}`, canvas.toBuffer('image/webp', 90));
     pages.push({ image, width: canvas.width, height: canvas.height, text });
    }
    manifest[`${category}/${renderer}/${slug}`] = {
     pdf: `/previews/${category}/${renderer}/${file}`,
     sha256: createHash('sha256').update(bytes).digest('hex'),
     pages
    };
   } finally { await pdf.destroy(); }
  }
 }
}
await writeFile('src/docs/pdf-pages.json', `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Physical page previews: ${Object.keys(manifest).length} documents, ${Object.values(manifest).reduce((total, doc) => total + doc.pages.length, 0)} raster pages generated from actual PDFs.`);
