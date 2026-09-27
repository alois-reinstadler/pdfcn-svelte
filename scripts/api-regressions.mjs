import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdir, writeFile } from 'node:fs/promises';
import { createServer as createViteServer } from 'vite';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { createCanvas } from '@napi-rs/canvas';
import { inspectPdf } from '../tests/render/pdf-inspection.mjs';
const server = await createViteServer({optimizeDeps:{noDiscovery:true},server:{middlewareMode:true,hmr:false},appType:'custom',logLevel:'error'});
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64');
const requests = [];
const http = createServer(async (req,res) => { let body='';for await(const chunk of req) body+=chunk;requests.push({method:req.method,auth:req.headers.authorization,body});if(req.url==='/missing'){res.writeHead(404);res.end();}else if(req.url==='/invalid'){res.end('not an image');}else{res.writeHead(200,{'Content-Type':'image/png'});res.end(png);}});
await new Promise(resolve=>http.listen(0,'127.0.0.1',resolve));
try {
 const {loadImage}=await server.ssrLoadModule('/src/lib/utils/image-source.ts');
 const uri=`http://127.0.0.1:${http.address().port}`;
 assert.match(await loadImage({uri,method:'POST',headers:{authorization:'test-token'},body:'image=one'}),/^data:image\/png;base64,/);
 assert.deepEqual(requests[0],{method:'POST',auth:'test-token',body:'image=one'});
 for(const [input,error] of [[{uri,method:'HEAD'},/HEAD/],[{uri,body:'ignored'},/GET cannot/],[{uri,cache:'ignored'},/Unsupported request options/],[`${uri}/missing`,/HTTP 404/],[`${uri}/invalid`,/Expected PNG or JPEG/]]) await assert.rejects(loadImage(input),error);
 const forme = await server.ssrLoadModule('@formepdf/svelte');
 const takumi = await server.ssrLoadModule('/src/lib/bases/takumi/server.ts');
 const {render}=await server.ssrLoadModule('svelte/server');
 for(const base of ['forme','takumi']) {
  const {default:Component}=await server.ssrLoadModule(`/tests/components/${base}-api-validation.svelte`);
  const renderPdf=base==='forme'?forme.renderDocument:takumi.renderDocument;
  const serialize=(kind,options)=>base==='forme'?forme.serialize(Component,{props:{kind,options}}):Promise.resolve().then(()=>render(Component,{props:{kind,options}}));
  for(const [kind,options,error] of [
   ['image',{src:{uri,headers:{authorization:'secret'}}},/string|loadImage/],
   ['image',{width:120,aspectRatio:0},/aspectRatio/],
   ['image',{width:'100%',aspectRatio:2},/numeric width/],
   ['image',{width:120,height:60,aspectRatio:2},/Choose aspectRatio/],
   ['form',{groups:[{fields:[{label:'Invalid',height:-1}]}]},/field.height/],
   ['signature',{variant:'single',signers:[{},{}]},/variant=double/],
   ['graph',{data:[{label:'NaN',value:NaN}]},/finite/],
   ['graph',{data:[{label:'Inf',value:Infinity}]},/finite/],
   ['graph',{variant:'pie',data:[{label:'Negative',value:-1}]},/nonnegative/],
   ['graph',{variant:'pie',data:[{name:'A',data:[]},{name:'B',data:[]}]},/one series/],
   ['graph',{variant:'horizontal-bar',data:[{name:'A',data:[]},{name:'B',data:[]}]},/one series/],
   ['graph',{data:[{name:'A',data:[{label:'A',value:1}]},{name:'B',data:[{label:'B',value:2}]}]},/same ordered labels/],
   ['graph',{colors:[]},/at least one color/],
   ['graph',{yTicks:1},/yTicks/],
   ['graph',{width:20},/width/],
   ['graph',{width:200,fullWidth:true},/Choose width/],
   ['graph',{data:[{label:'START'+'X'.repeat(240)+'END',value:1}]},/Shorten identifiers/]
  ]) await assert.rejects(serialize(kind,options),error,`${base}:${kind} must reject ${JSON.stringify(options)}`);
  if(base==='forme') for(const [kind,options,error] of [['heading',{keepWithNext:true},/Wrap the heading/],['keep',{minPresenceAhead:20},/following content/],['watermark',{position:'bottom-right'},/centered/],['watermark',{fixed:false},/repeated/],['image',{fit:'contain'},/fit="fill"/],['image',{position:'top'},/positioning/]]) await assert.rejects(serialize(kind,options),error);
  for(const [kind,options,markers] of [
   ['signature',{variant:'inline',name:'Signer',title:'TITLE RETAINED',date:'DATE RETAINED'},['TITLE RETAINED','DATE RETAINED']],
   ['list',{},['Description preserved','Nested preserved']],
   ['graph',{variant:'pie',showValues:true,data:[{label:'Large',value:10000},{label:'Tiny',value:1},{label:'Zero',value:0}]},['Large','Tiny','Zero']],
   ['graph',{variant:'donut',centerLabel:'CENTER'},['CENTER']],
   ['graph',{variant:'line',showValues:true,xLabel:'X AXIS',yLabel:'Y AXIS',data:[{label:'Negative',value:-11},{label:'Positive',value:17}]},['-11','17','X AXIS','Y AXIS']],
   ['graph',{variant:'bar',showValues:true,data:[{label:'Negative',value:-11},{label:'Positive',value:17}]},['-11','17']],
   ['graph',{variant:'bar',data:[{label:'Full category label preserved',value:7}]},['Full category label preserved']],
   ['graph',{variant:'line',data:[{label:'CUSTOM',value:7}]},['CUSTOM']]
  ]) {const pdf=await renderPdf(Component,{props:{kind,options}});const inspected=await inspectPdf(pdf);for(const marker of markers)assert.ok(inspected.text.includes(marker),`${base} ${kind} missing ${marker}`);
   if(process.env.PDFCN_REGRESSION_ARTIFACTS && kind === 'graph') {const dir=process.env.PDFCN_REGRESSION_ARTIFACTS;await mkdir(dir,{recursive:true});const doc=await getDocument({data:pdf.slice(),disableWorker:true,standardFontDataUrl:`${process.cwd()}/node_modules/pdfjs-dist/standard_fonts/`}).promise;const page=await doc.getPage(1);const viewport=page.getViewport({scale:1.5});const canvas=createCanvas(Math.ceil(viewport.width),Math.ceil(viewport.height));await page.render({canvasContext:canvas.getContext('2d'),viewport}).promise;await writeFile(`${dir}/${base}-${options.variant}.png`,canvas.toBuffer('image/png'));await writeFile(`${dir}/${base}-${options.variant}.pdf`,pdf);await doc.destroy();}
  }
  const serialized=await serialize('form',{});
  if(base==='forme')assert.match(JSON.stringify(serialized),/"width":\{"Pt":120\}/,'field width must serialize as 120pt');
  else assert.match(serialized.body,/width:160px/,'120pt field width must convert to 160 CSS pixels');
  console.log(`${base}: image requests, field width, signature text, nested lists, chart inputs and labels verified`);
 }
 const {default:FormeApi}=await server.ssrLoadModule('/tests/components/forme-api-validation.svelte');
await assert.rejects(forme.renderDocument(FormeApi,{props:{kind:'image',options:{src:'/tmp/pdfcn-missing-image-assertion.png'}}}),/loadImage/);
 await assert.rejects(forme.renderDocument(FormeApi,{props:{kind:'image',options:{src:'data:image/png;base64,AAAA'}}}),/PNG or JPEG/);
 await assert.rejects(forme.renderDocument(FormeApi,{props:{kind:'heading',fonts:[{family:'Missing',src:'/tmp/pdfcn-missing-font-assertion.ttf'}]}}),/font|ENOENT|not found/i);
 const imageCanvas=createCanvas(100,50);imageCanvas.getContext('2d').fillRect(0,0,100,50);
 const imageResult=await forme.renderDocumentWithLayout(FormeApi,{props:{kind:'image',options:{src:imageCanvas.toDataURL('image/png'),width:100}}});
 const visit=node=>node.kind==='Image'?node:(node.children??[]).map(visit).find(Boolean);
 const imageNode=imageResult.layout.pages[0].elements.map(visit).find(Boolean);
 assert.equal(imageNode.width,100);assert.equal(imageNode.height,50,'one image dimension must preserve intrinsic ratio');
 const {default:Table}=await server.ssrLoadModule('/tests/components/forme-table-widths.svelte');
 const pdf=await forme.renderDocument(Table);
 const doc=await getDocument({data:pdf.slice(),disableWorker:true,standardFontDataUrl:`${process.cwd()}/node_modules/pdfjs-dist/standard_fonts/`}).promise;
 const page=await doc.getPage(1);const {items}=await page.getTextContent();
 const header=items.find(x=>x.str==='Description'),row=items.find(x=>x.str==='Readable row');
 assert.ok(header.transform[5]-row.transform[5]<35,'percentage columns must not inflate header height (145pt in Forme0.11.1, fixed by Forme0.25.0)');
 const amount=items.find(x=>x.str==='Amount');assert.ok(amount.transform[4]>480&&amount.transform[4]<500,'15% amount column must retain its position');
 if(process.env.PDFCN_REGRESSION_ARTIFACTS){const dir=process.env.PDFCN_REGRESSION_ARTIFACTS;await mkdir(dir,{recursive:true});const viewport=page.getViewport({scale:1.5});const canvas=createCanvas(Math.ceil(viewport.width),Math.ceil(viewport.height));await page.render({canvasContext:canvas.getContext('2d'),viewport}).promise;await writeFile(`${dir}/forme-percentage-table.png`,canvas.toBuffer('image/png'));await writeFile(`${dir}/forme-percentage-table.pdf`,pdf);}
 await doc.destroy();
 for(const count of [240,2400]) {
  const token='START'+'X'.repeat(count)+'END';
  const longPdf=await forme.renderDocument(Table,{props:{description:token}});
  const longDoc=await getDocument({data:longPdf.slice(),disableWorker:true,standardFontDataUrl:`${process.cwd()}/node_modules/pdfjs-dist/standard_fonts/`}).promise;
  let text='';
  for(let n=1;n<=longDoc.numPages;n++){const p=await longDoc.getPage(n);const {items}=await p.getTextContent();for(const item of items.filter(i=>i.str.trim())){assert.ok(item.transform[4]+item.width<=p.view[2]-39,`long table token exceeds right page margin on page ${n}`);assert.ok(item.transform[5]>=39,`long table token below bottom margin on page ${n}`);if(item.transform[4]<320)text+=item.str;}}
  assert.ok(text.replace(/\s/g,'').includes(token),'unbroken table content must survive including both ends');
  await longDoc.destroy();
 }
 console.log('Forme percentage columns: physical positions and compact row height verified');
} finally {await server.close();await new Promise(resolve=>http.close(resolve));}
