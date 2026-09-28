import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { inspectPdf } from '../tests/render/pdf-inspection.mjs';
const server=await createServer({server:{middlewareMode:true,hmr:false},optimizeDeps:{noDiscovery:true},appType:'custom',logLevel:'error'});
try {
 const api=await server.ssrLoadModule('/src/lib/bases/forme/server.ts');
 const {default:Fixture}=await server.ssrLoadModule('/tests/release/forme-output.svelte');
 for(const scenario of ['oversize','nowrap']) await assert.rejects(api.renderDocument(Fixture,{props:{scenario}}),/Atomic content.*(?:tall|split)/);
 for(const scenario of ['clip','offpage','partial']) await assert.rejects(api.renderDocument(Fixture,{props:{scenario}}),/content audit failed|extends beyond physical page/);
 await assert.rejects(api.renderDocument(Fixture,{props:{scenario:'overlap'}}),/Body content overlaps the repeated footer/);
 await assert.rejects(api.renderDocument(Fixture,{auditContent:false}),/cannot be disabled/);
 for(const scenario of ['badimage','missingimage']) await assert.rejects(api.renderDocument(Fixture,{props:{scenario}}),/PNG|JPEG|loadImage/);
 await assert.rejects(api.renderDocument(Fixture,{props:{scenario:'missingfont'}}),/font|ENOENT|not found/i);
 const image=await api.renderDocumentWithLayout(Fixture,{props:{scenario:'image'}});
 assert.ok(JSON.stringify(image.layout).includes('"nodeType":"Image"'),'resolved image must remain in physical output');
 await assert.rejects(api.renderDocument(Fixture,{props:{scenario:'largefooter'}}),/header\/footer extends beyond physical page/);
 const largeHeader=await inspectPdf(await api.renderDocument(Fixture,{props:{scenario:'largeheader'}}));
 for(let i=1;i<=35;i++)assert.ok(largeHeader.text.includes(`BAND BODY LINE ${i}`),'large header must reserve body space and preserve every line');
 const normal=await api.renderDocumentWithLayout(Fixture,{props:{scenario:'normal'},auditContent:true});
 assert.equal(normal.layout.pages.length,1);
 assert.ok(!JSON.stringify(normal.layout).includes('pdfcn:layout-audit'),'internal audit identifiers must not leak into the public layout');
 const flowing=await inspectPdf(await api.renderDocument(Fixture,{props:{scenario:'flow'}}));
 assert.ok(flowing.pages>1);
 for(let i=1;i<=60;i++)assert.equal((flowing.text.match(new RegExp(`LINE ${i} retained\\.`, 'g'))??[]).length,1,`flow line ${i} must survive once`);
 assert.ok(flowing.pageTexts.every(text=>text.includes('FOOTER')),'fixed footer remains on every physical page');
 const empty=await inspectPdf(await api.renderDocument(Fixture,{props:{scenario:'empty'}}));
 assert.ok(empty.pages>=2);assert.match(empty.pageTexts.at(-1),/INTENTIONAL SECOND PAGE/);
 console.log(`Forme checked adapter: oversized atomic groups, clipped/off-page content and disabled audit rejected; 60 flow lines across ${flowing.pages} pages retained, fixed footers repeated, intentional empty page allowed.`);
} finally {await server.close()}
