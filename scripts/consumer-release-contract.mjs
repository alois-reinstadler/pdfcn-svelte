/** Real consumer release gate. No registry file is copied by this test: shadcn-svelte installs it. */
import assert from 'node:assert/strict';
import semver from 'semver';
import { spawn, spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, readdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { packageSource } from '../src/docs/package-source.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
const workspace = await mkdtemp(join(tmpdir(), 'pdfcn-release-consumers-'));
const slug = process.env.PDFCN_CONSUMER_PREVIEW_SLUG ?? 'pdfcn-consumer-release';
const hosted = process.argv.includes('--hosted');
const skipPackages = process.argv.includes('--registry-only');
const registry = process.env.PDFCN_REGISTRY_URL ?? 'https://alois-reinstadler.github.io/pdfcn-svelte/r';
const svVersion = '0.17.1';
const cliVersion = '1.7.0';
let sequence = 0;
let previewOwned = false;
let ciServer;
const managed = spawnSync('dev-preview', ['--help'], { stdio: 'ignore' }).status === 0;
if (!managed && !process.env.CI) throw new Error('Local HTTP verification requires dev-preview. CI may use an ephemeral loopback server.');
const report = { node: process.version, packageManager: pkg.packageManager, sv: svVersion, shadcn: cliVersion, registry: hosted ? registry : 'local generated artifacts', workspace, consumers: [] };
console.log(`Consumer logs and artifacts: ${workspace}`);

async function run(command, args, cwd = root) {
 const label = `${String(++sequence).padStart(3, '0')}-${command.replaceAll('/', '-')}`;
 const printable = [command, ...args].map(x => `'${x.replaceAll("'", "'\\''")}'`).join(' ');
 await writeFile(join(workspace, `${label}.command.txt`), `cd '${cwd}'\n${printable}\n`);
 return await new Promise((resolveRun, reject) => {
  const child = spawn(command, args, { cwd, env: { ...process.env, CI: 'true', NO_COLOR: '1' }, stdio: ['pipe', 'pipe', 'pipe'] });
  let output = '';
  let answeredCss = false;
  const timer = setTimeout(() => { child.kill('SIGTERM'); }, 240_000);
  child.on('error', reject);
  const collect = (chunk) => {
   const value = chunk.toString(); output += value;
   // shadcn init has an intentional CSS consent prompt, even with a complete preset.
   // Keep stdin open and accept only this known prompt in our newly-created disposable app.
   if (!answeredCss && output.includes('Continue?') && output.includes('overwritten')) { answeredCss = true; setTimeout(() => child.stdin.write('\r'), 100); }
  };
  child.stdout.on('data', collect); child.stderr.on('data', collect);
  child.on('close', async code => {
   clearTimeout(timer);
   await writeFile(join(workspace, `${label}.log`), output);
   if (code === 0) resolveRun(output);
   else reject(new Error(`${printable} failed (${code}) in ${cwd}\n${output.slice(-18000)}\nLogs: ${workspace}`));
  });
 });
}
async function put(path, source) { await mkdir(dirname(path), { recursive: true }); await writeFile(path, source); }
async function stopPreview() {
 if (ciServer) { const child = ciServer; ciServer = undefined; process.kill(-child.pid, 'SIGTERM'); await new Promise(resolve => child.once('close', resolve)); }
 if (previewOwned) { await run('dev-preview', ['stop', slug]); previewOwned = false; }
}
async function startPreview(cwd, command, healthPath = '/') {
 await stopPreview();
 if (managed) {
  const output = await run('dev-preview', ['start', slug, '--cwd', cwd, '--timeout', '120', '--health-path', healthPath, '--', ...command]);
  previewOwned = true;
  const url = output.match(/Browser\/tools: (http:\/\/127\.0\.0\.1:\d+)/)?.[1];
  assert.ok(url, `Missing manager local URL: ${output}`);
  return url;
 }
 // CI has no shared container preview manager. Port 0 lets the OS allocate a
 // loopback-only port; a preload observes the actual HTTP listening address.
 const preload = join(workspace, 'ci-listen.mjs');
 await put(preload, `import { Server } from 'node:http';\nconst listen=Server.prototype.listen;\nServer.prototype.listen=function(...args){this.once('listening',()=>{const a=this.address();if(a&&typeof a==='object')console.log('PDFCN_CI_URL=http://127.0.0.1:'+a.port)});return listen.apply(this,args)};\n`);
 const args = command.slice(1).map(value => value === '{host}' ? '127.0.0.1' : value === '{port}' ? '0' : value);
 const child = spawn(command[0], args, { cwd, detached: true, env: {...process.env, HOST:'127.0.0.1',PORT:'0', NODE_OPTIONS: `${process.env.NODE_OPTIONS ?? ''} --import=${preload}` }, stdio:['ignore','pipe','pipe'] });
 ciServer = child;
 let output = '';
 child.stdout.on('data', b => output += b); child.stderr.on('data', b => output += b);
 for (let attempt=0; attempt<120; attempt++) {
  if(child.exitCode !== null) throw new Error(`CI server exited: ${output}`);
  for (const [,url] of output.matchAll(/PDFCN_CI_URL=(http:\/\/127\.0\.0\.1:\d+)/g)) {
   try { const response = await fetch(url + healthPath); if(response.ok) { await put(join(workspace, `ci-server-${sequence}.log`), output); return url; } } catch {}
  }
  await new Promise(resolve => setTimeout(resolve, 500));
 }
 throw new Error(`CI server readiness failed: ${output}`);
}
async function createApp(name, copied) {
 const app = join(workspace, name);
 await run('pnpm', ['dlx', `sv@${svVersion}`, 'create', app, '--template', 'minimal', '--types', 'ts', '--add', ...(copied ? ['tailwindcss=plugins:none'] : []), 'sveltekit-adapter=adapter:node', '--no-install']);
 const manifest = JSON.parse(await readFile(join(app, 'package.json'), 'utf8'));
 manifest.packageManager = pkg.packageManager;
 await put(join(app, 'package.json'), JSON.stringify(manifest, null, 2));
 await run('pnpm', ['install'], app);
 if (copied) {
  await run('pnpm', ['dlx', `shadcn-svelte@${cliVersion}`, 'init', '--preset', 'b0', '--base-color', 'neutral', '--css', 'src/routes/layout.css', '--components-alias', '$lib/components', '--lib-alias', '$lib', '--utils-alias', '$lib/utils', '--hooks-alias', '$lib/hooks', '--ui-alias', '$lib/components/ui'], app);
  assert.ok((await readFile(join(app, 'components.json'), 'utf8')).includes('"style"'), 'CLI init must finish');
  assert.ok((await readFile(join(app, 'src/routes/layout.css'), 'utf8')).includes('shadcn-svelte/tailwind.css'), 'CLI init must apply CSS and install dependencies, not silently exit at its prompt');
 }
 return app;
}
async function validatePdf(url, path, output) {
 const response = await fetch(`${url}${path}`);
 assert.equal(response.status, 200, `${path}: ${response.status} ${await (response.status === 200 ? Promise.resolve('') : response.text())}`);
 assert.match(response.headers.get('content-type') ?? '', /application\/pdf/);
 const bytes = new Uint8Array(await response.arrayBuffer());
 assert.equal(new TextDecoder().decode(bytes.subarray(0, 5)), '%PDF-');
 assert.ok(bytes.length > 1000);
 await put(output, bytes);
 return bytes.length;
}
async function assertIsolation(app, base, copied = false) {
 const manifest = JSON.parse(await readFile(join(app, 'package.json'), 'utf8'));
 const declared = { ...manifest.dependencies, ...manifest.devDependencies };
 const forbidden = base === 'forme' ? ['takumi-pdf', '@takumi-rs/helpers'] : ['@formepdf/core', '@formepdf/svelte'];
 for (const name of forbidden) {
  assert.ok(!declared[name], `${base} consumer must not declare ${name}`);
  let found = false;
  try { await readFile(join(app, 'node_modules', name, 'package.json')); found = true; } catch {}
  assert.equal(found, false, `${base} consumer must not resolve unselected ${name}`);
 }
 if (copied) {
  assert.ok(!declared['pdfcn-svelte'], 'Copied-source consumer must not rely on the package');
  if (!hosted) for (const name of base === 'forme' ? ['@formepdf/core', '@formepdf/svelte'] : ['takumi-pdf', '@takumi-rs/helpers']) {
   const supported = pkg.peerDependencies[name];
   // pnpm may save a narrower caret range starting at the resolved version.
   // It must never widen support, and the actual installed version must comply.
   assert.ok(semver.subset(declared[name], supported), `CLI range ${name}@${declared[name]} must be contained in ${supported}`);
   const installed = JSON.parse(await readFile(join(app, 'node_modules', name, 'package.json'), 'utf8')).version;
   assert.ok(semver.satisfies(installed, supported), `${name}@${installed} must satisfy ${supported}`);
   const item = JSON.parse(await readFile(join(root, 'public/r', base, 'utils.json'), 'utf8'));
   assert.ok(item.dependencies.includes(`${name}@${supported}`), `Registry must request the declared range for ${name}`);
  }
 }
}
async function configure(app, base, copied) {
 const pdfRenderer = base === 'forme' ? copied ? '$lib/bases/forme/server' : 'pdfcn-svelte/bases/forme/server' : copied ? '$lib/bases/takumi/server' : 'pdfcn-svelte/bases/takumi/server';
 let source = await readFile(join(root, `src/docs/examples/${base}/text.svelte`), 'utf8');
 if (copied) {
  source = source.replace("import { PdfcnThemeProvider } from '$lib/index';", "import PdfcnThemeProvider from '$lib/PdfcnThemeProvider.svelte';")
   .replace("from '$lib/themes'", "from '$lib/themes/professional'")
   .replace(`import { Document, Page, Text } from '$lib/bases/${base}';`, `${base === 'forme' ? "import { Document, Page } from '$lib/bases/forme/lib/pdf-primitives';" : "import Document from '$lib/bases/takumi/lib/Document.svelte';\n import Page from '$lib/bases/takumi/lib/Page.svelte';"}\n import Text from '$lib/bases/${base}/components/text/text.svelte';`);
 } else source = packageSource(source);
 await put(join(app, 'src/lib/Example.svelte'), source);
 let endpoint = await readFile(join(root, `src/docs/examples/${base}-endpoint.ts.txt`), 'utf8');
 if (copied) endpoint = endpoint.replace(`pdfcn-svelte/bases/${base}/server`, `$lib/bases/${base}/server`);
 await put(join(app, 'src/routes/example.pdf/+server.ts'), endpoint);
 const files = [];
 if (!copied) {
  for (const folder of ['examples', 'template-examples', 'pagination-examples']) {
   let names;
   try { names = await readdir(join(root, 'src/docs', folder, base)); } catch (error) { if (error.code === 'ENOENT' && folder === 'pagination-examples') continue; throw error; }
   for (const name of names.filter(x => x.endsWith('.svelte'))) {
    const id = `${folder}-${name.slice(0, -7)}`; files.push(id);
    await put(join(app, `src/lib/shown/${id}.svelte`), packageSource(await readFile(join(root, 'src/docs', folder, base, name), 'utf8')));
   }
  }
  await put(join(app, 'src/routes/shown/[example]/+server.ts'), `import { renderDocument } from '${pdfRenderer}';\nconst examples = import.meta.glob('/src/lib/shown/*.svelte');\nexport async function GET({ params }) {\n const load = examples['/src/lib/shown/' + params.example + '.svelte'];\n if (!load) return new Response('Unknown example', { status: 404 });\n const { default: component } = await load() as { default: any };\n const bytes = await renderDocument(component);\n return new Response(new Uint8Array(bytes), { headers: { 'content-type': 'application/pdf' } });\n}\n`);
 } else {
  let invoice = await readFile(join(root, `src/docs/template-examples/${base}/invoice-modern.svelte`), 'utf8');
  invoice = invoice.replace("from '$lib/themes'", "from '$lib/themes/professional'")
   .replace(`import { InvoiceModern, type InvoiceModernData } from '$lib/bases/${base}';`, `import InvoiceModern from '$lib/bases/${base}/blocks/invoice-modern/invoice-modern.svelte';\n import type { InvoiceModernData } from '$lib/bases/${base}/blocks/invoice-modern/invoice-modern.types';`);
  await put(join(app, 'src/lib/Invoice.svelte'), invoice);
  await put(join(app, 'src/routes/invoice.pdf/+server.ts'), endpoint.replace('$lib/Example.svelte', '$lib/Invoice.svelte'));
  // Exercise the installed theme as an actual import, not only a file-exists check.
  await put(join(app, 'src/lib/theme-check.ts'), `import { modernTheme } from '$lib/themes/modern';\nexport const installedTheme = modernTheme;\n`);
 }
 await put(join(app, 'src/routes/+page.svelte'), base === 'takumi'
  ? `<script lang="ts">${copied ? "import Text from '$lib/bases/takumi/components/text/text.svelte';" : "import { Text } from 'pdfcn-svelte/bases/takumi';"}</script><h1>Independent ${base} consumer</h1><Text>Browser component preview</Text><a href="/example.pdf">Open generated PDF</a><a href="/invoice.pdf">Open invoice PDF</a>`
  : '<h1>Independent Forme consumer</h1><a href="/example.pdf">Open generated PDF</a>');
 return files;
}
async function verifyApp(app, base, copied) {
 await assertIsolation(app, base, copied);
 const files = await configure(app, base, copied);
 await run('pnpm', ['check'], app);
 let url = await startPreview(app, ['pnpm', 'exec', 'vite', 'dev', '--host', '{host}', '--port', '{port}', '--strictPort']);
 const dev = await validatePdf(url, '/example.pdf', join(app, 'verified-dev.pdf'));
 if (copied) await validatePdf(url, '/invoice.pdf', join(app, 'verified-invoice-dev.pdf'));
 await stopPreview();
 const build = await run('pnpm', ['build'], app);
 assert.doesNotMatch(build, /externalized for browser compatibility/, 'Browser imports must not pull Node modules');
 const assetRoot = join(app, '.svelte-kit/output/client');
 const paths = await readdir(assetRoot, { recursive: true });
 assert.ok(!paths.some(path => /\.(wasm|node)$/.test(path)), 'No renderer binaries in browser assets');
 for (const path of paths.filter(path => path.endsWith('.js'))) {
  const javascript = await readFile(join(assetRoot, path), 'utf8');
  assert.doesNotMatch(javascript, /node:async_hooks|node:fs|takumi-pdf|@formepdf\/core/, 'No server renderer in browser code');
 }
 url = await startPreview(app, ['node', 'build']);
 const production = await validatePdf(url, '/example.pdf', join(app, 'verified-production.pdf'));
 if (copied) await validatePdf(url, '/invoice.pdf', join(app, 'verified-invoice-production.pdf'));
 for (const id of files) await validatePdf(url, `/shown/${id}`, join(app, 'shown-pdfs', `${id}.pdf`));
 await stopPreview();
 const versions = JSON.parse(await run('pnpm', ['list', '--depth', '0', '--json'], app));
 report.consumers.push({ app, base, copied, devBytes: dev, productionBytes: production, displayedExamples: files.length, versions });
 await put(join(workspace, 'results.json'), JSON.stringify(report, null, 2));
 console.log(`${copied ? 'CLI copied' : 'Package'} ${base}: dev ${dev} bytes; production ${production} bytes; ${files.length} displayed examples rendered; browser assets clean.`);
}

try {
 await run('pnpm', ['run', 'registry:build']);
 const copiedApps = [];
 for (const base of ['forme', 'takumi']) copiedApps.push({ base, app: await createApp(`copied-${base}`, true) });
 let registryUrl = registry;
 if (!hosted) {
  // A static server exposes only the generated registry; all copying and dependency resolution is CLI-owned.
  await put(join(workspace, 'registry-server.mjs'), `import {createServer} from 'node:http';\nimport {readFile} from 'node:fs/promises';\nimport {resolve} from 'node:path';\nconst root=${JSON.stringify(join(root, 'public'))};\ncreateServer(async(req,res)=>{try {const p=resolve(root,'.'+new URL(req.url,'http://local').pathname);if(!p.startsWith(root+'/'))throw Error();const b=await readFile(p);res.writeHead(200,{'content-type':'application/json'});res.end(b);}catch{res.writeHead(404);res.end('Not found');}}).listen(Number(process.env.PORT),process.env.HOST);\n`);
  registryUrl = `${await startPreview(workspace, ['node', 'registry-server.mjs'], '/r/forme/alert.json')}/r`;
 }
 for (const { app, base } of copiedApps) {
  await run('pnpm', ['dlx', `shadcn-svelte@${cliVersion}`, 'add', `${registryUrl}/${base}/alert.json`, `${registryUrl}/${base}/invoice-modern.json`, `${registryUrl}/${base}/theme-modern.json`, '--yes', '--overwrite'], app);
  for (const path of [`bases/${base}/components/alert/alert.svelte`, `bases/${base}/blocks/invoice-modern/invoice-modern.svelte`, 'themes/modern.ts']) assert.ok((await readFile(join(app, 'src/lib', path), 'utf8')).length);
 }
 await stopPreview();
 for (const {app,base} of copiedApps) await verifyApp(app, base, true);
 if (!skipPackages) {
  const pack = join(workspace, 'pack'); await mkdir(pack);
  await run('pnpm', ['run', 'package']);
  await run('pnpm', ['pack', '--pack-destination', pack]);
  const tarball = join(pack, (await readdir(pack)).find(x => x.endsWith('.tgz')));
  for (const base of ['forme', 'takumi']) {
   const app = await createApp(`package-${base}`, false);
   const names = base === 'forme' ? ['@formepdf/core', '@formepdf/svelte'] : ['takumi-pdf', '@takumi-rs/helpers'];
   await run('pnpm', ['add', tarball, ...names.map(name => `${name}@${pkg.peerDependencies[name]}`)], app);
   await verifyApp(app, base, false);
  }
  const browserApp = await createApp('browser-only', false);
  await run('pnpm', ['add', tarball], browserApp);
  for (const name of ['@formepdf/core', '@formepdf/svelte', 'takumi-pdf', '@takumi-rs/helpers']) {
   let resolved = false; try { await readFile(join(browserApp, 'node_modules', name, 'package.json')); resolved = true; } catch {}
   assert.equal(resolved, false, `Browser-only install must not install ${name}`);
  }
  await put(join(browserApp, 'src/routes/+page.svelte'), `<script lang="ts">import { Text, Graph } from 'pdfcn-svelte/bases/takumi';</script><h1>Browser without PDF renderers</h1><Text>No renderer installed</Text><Graph data={[{label:'Only one label',value:12}]} />`);
  await run('pnpm', ['check'], browserApp);
  const browserBuild = await run('pnpm', ['build'], browserApp);
  assert.doesNotMatch(browserBuild, /externalized for browser compatibility/);
  const browserAssets = await readdir(join(browserApp, '.svelte-kit/output/client'), {recursive:true});
  assert.ok(!browserAssets.some(name => /\.(wasm|node)$/.test(name)));
  const browserUrl = await startPreview(browserApp, ['node', 'build']);
  assert.match(await (await fetch(browserUrl)).text(), /No renderer installed/);
  await stopPreview();
  report.consumers.push({app:browserApp, base:'browser-only', renderersInstalled:0, production:true});
  await put(join(workspace, 'results.json'), JSON.stringify(report, null, 2));
 }
 console.log(`Release consumer matrix passed. Exact commands, logs, resolved versions, and PDFs: ${workspace}`);
} finally {
 await stopPreview();
}
