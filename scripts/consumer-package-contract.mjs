import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import {
	cp,
	mkdir,
	mkdtemp,
	readFile,
	readdir,
	rm,
	writeFile
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import { packageSource } from '../src/docs/package-source.mjs';

const execFileAsync = promisify(execFile);
const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fixtureRoot = join(repositoryRoot, 'tests', 'consumer');
const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const nodeCommand = process.execPath;
const startedAt = performance.now();
const temporaryRoot = await mkdtemp(join(tmpdir(), 'pdfcn-svelte-consumer-'));
const packRoot = join(temporaryRoot, 'pack');
const consumerRoot = join(temporaryRoot, 'consumer');

async function run(command, args, options = {}) {
	const { stdout, stderr } = await execFileAsync(command, args, {
		cwd: repositoryRoot,
		env: {
			...process.env,
			CI: 'true'
		},
		maxBuffer: 20 * 1024 * 1024,
		...options
	});
	return { stdout, stderr };
}

try {
	await Promise.all([
		import('node:fs/promises').then(({ mkdir }) =>
			mkdir(packRoot, { recursive: true })
		),
		import('node:fs/promises').then(({ mkdir }) =>
			mkdir(consumerRoot, { recursive: true })
		)
	]);

	// Build first so this contract can be run independently of the rest of the
	// validation pipeline and always exercises the current source tree.
	await run(pnpmCommand, ['--silent', 'run', 'package']);
	await run(pnpmCommand, ['--silent', 'pack', '--pack-destination', packRoot]);

	const tarballs = (await readdir(packRoot)).filter((name) =>
		name.endsWith('.tgz')
	);
	assert.equal(
		tarballs.length,
		1,
		`expected one package tarball, found ${tarballs.length}`
	);
	const tarballPath = join(packRoot, tarballs[0]);

	const rootPackage = JSON.parse(
		await readFile(join(repositoryRoot, 'package.json'), 'utf8')
	);
	const consumerPackage = {
		name: 'pdfcn-svelte-package-contract-consumer',
		private: true,
		type: 'module',
		packageManager: rootPackage.packageManager,
		dependencies: {
			'pdfcn-svelte': `file:${tarballPath}`,
			'@formepdf/core': rootPackage.peerDependencies['@formepdf/core'],
			'@formepdf/svelte': rootPackage.peerDependencies['@formepdf/svelte'],
			'@takumi-rs/helpers': rootPackage.peerDependencies['@takumi-rs/helpers'],
			svelte: rootPackage.peerDependencies.svelte,
			'takumi-pdf': rootPackage.peerDependencies['takumi-pdf'],
			qrcode: rootPackage.dependencies.qrcode
		},
		devDependencies: {
			'@sveltejs/vite-plugin-svelte':
				rootPackage.devDependencies['@sveltejs/vite-plugin-svelte'],
			'@types/node': rootPackage.devDependencies['@types/node'],
			'@types/qrcode': rootPackage.devDependencies['@types/qrcode'],
			'svelte-check': rootPackage.devDependencies['svelte-check'],
			typescript: rootPackage.devDependencies.typescript,
			vite: rootPackage.devDependencies.vite
		}
	};

	await Promise.all([
		writeFile(
			join(consumerRoot, 'package.json'),
			`${JSON.stringify(consumerPackage, null, 2)}\n`
		),
		cp(fixtureRoot, consumerRoot, { recursive: true })
	]);

	let displayedSourceCount = 0;
	// Typecheck the exact public-import source shown in documentation, not lookalike fixtures.
	for (const folder of ['examples', 'template-examples', 'pagination-examples'])
		for (const base of ['forme', 'takumi']) {
			const sourceRoot = join(repositoryRoot, 'src/docs', folder, base);
			const destination = join(consumerRoot, 'src/docs', folder, base);
			await mkdir(destination, { recursive: true });
			const names = await readdir(sourceRoot).catch(error => {
				if (error.code === 'ENOENT' && folder === 'pagination-examples') return [];
				throw error;
			});
			for (const name of names) {
				displayedSourceCount++;
				await writeFile(
					join(destination, name),
					packageSource(await readFile(join(sourceRoot, name), 'utf8'))
				);
			}
		}
	// Materialize dependency graphs exactly as the registry declares, in this fresh consumer.
	const installed = new Set();
	async function copyItem(base, slug) {
		const key = `${base}/${slug}`;
		if (installed.has(key)) return;
		installed.add(key);
		const item = JSON.parse(
			await readFile(
				join(repositoryRoot, 'public/r', base, `${slug}.json`),
				'utf8'
			)
		);
		for (const dependency of item.registryDependencies ?? [])
			await copyItem(
				base,
				dependency.replace(/^\.\//, '').replace(/\.json$/, '')
			);
		for (const file of item.files) {
			const target = join(consumerRoot, file.target.replace(/^~\//, ''));
			await mkdir(dirname(target), { recursive: true });
			await writeFile(target, file.content);
		}
	}
	for (const base of ['forme', 'takumi'])
		await copyItem(base, 'invoice-modern');
	const configPath = join(consumerRoot, 'vite.config.ts');
	const config = await readFile(configPath, 'utf8');
	await writeFile(
		configPath,
		config.replace(
			'plugins: [svelte()],',
			`plugins: [svelte()],\n resolve: { alias: { '$lib': new URL('./src/lib', import.meta.url).pathname } },`
		)
	);
	const tsconfigPath = join(consumerRoot, 'tsconfig.json');
	const tsconfig = JSON.parse(await readFile(tsconfigPath, 'utf8'));
	tsconfig.compilerOptions.paths = { '$lib/*': ['./src/lib/*'] };
	await writeFile(tsconfigPath, JSON.stringify(tsconfig, null, 2));
	await writeFile(
		join(consumerRoot, 'src/lib/Example.svelte'),
		await readFile(
			join(repositoryRoot, 'src/docs/copied-invoice.svelte.txt'),
			'utf8'
		)
	);
	await writeFile(
		join(consumerRoot, 'src/copied-endpoint.ts'),
		await readFile(
			join(repositoryRoot, 'src/docs/copied-endpoint.ts.txt'),
			'utf8'
		)
	);
	for (const base of ['forme', 'takumi']) {
		const endpoint = await readFile(
			join(repositoryRoot, `src/docs/examples/${base}-endpoint.ts.txt`),
			'utf8'
		);
		await writeFile(
			join(consumerRoot, `src/${base}-endpoint.ts`),
			endpoint.replace(
				"'$lib/Example.svelte'",
				` './docs/examples/${base}/text.svelte'`
			)
		);
		const source = await readFile(
			join(
				repositoryRoot,
				`src/docs/template-examples/${base}/invoice-modern.svelte`
			),
			'utf8'
		);
		const copied = source
			.replace("from '$lib/themes'", "from '$lib/themes/professional'")
			.replace(
				`import { InvoiceModern, type InvoiceModernData } from '$lib/bases/${base}';`,
				`import InvoiceModern from '$lib/bases/${base}/blocks/invoice-modern/invoice-modern.svelte';\n import type { InvoiceModernData } from '$lib/bases/${base}/blocks/invoice-modern/invoice-modern.types';`
			);
		await writeFile(join(consumerRoot, `src/Copied${base}.svelte`), copied);
	}
	await writeFile(
		join(consumerRoot, 'src/docs-runtime.ts'),
		`
import { GET as forme } from './forme-endpoint';
import { GET as takumi } from './takumi-endpoint';
import { GET as copied } from './copied-endpoint';
import FormeInvoice from './Copiedforme.svelte';
import TakumiInvoice from './Copiedtakumi.svelte';
import { renderDocument as renderForme } from '@formepdf/svelte';
import { renderDocument as renderTakumi } from '$lib/bases/takumi/server';
export async function verifyDocs() {
 const responses = await Promise.all([forme(), takumi(), copied()]);
 const outputs: Uint8Array[] = await Promise.all(responses.map(async response => {
   if (response.headers.get('content-type') !== 'application/pdf') throw new Error('Incorrect endpoint content type');
   return new Uint8Array(await response.arrayBuffer());
 }));
 outputs.push(await renderForme(FormeInvoice), await renderTakumi(TakumiInvoice));
 for (const bytes of outputs) if (new TextDecoder().decode(bytes.subarray(0, 5)) !== '%PDF-' || bytes.length < 1000) throw new Error('Documentation PDF render failed');
 return outputs.map(bytes => bytes.length);
}`
	);

	await run(pnpmCommand, ['install', '--prefer-offline', '--no-lockfile'], {
		cwd: consumerRoot
	});

	const svelteCheck = join(
		consumerRoot,
		'node_modules',
		'.bin',
		process.platform === 'win32' ? 'svelte-check.cmd' : 'svelte-check'
	);
	await run(svelteCheck, ['--tsconfig', './tsconfig.json'], {
		cwd: consumerRoot
	});

	const vite = join(
		consumerRoot,
		'node_modules',
		'.bin',
		process.platform === 'win32' ? 'vite.cmd' : 'vite'
	);
	// PDF renderers are server-side dependencies (Forme ships Wasm and Takumi
	// reads native assets), so the relevant production compilation contract is
	// an SSR build. svelte-check above still validates the browser-facing sample.
	await run(vite, ['build', '--ssr', 'src/runtime-check.ts'], {
		cwd: consumerRoot
	});

	const builtRuntime = await run(
		nodeCommand,
		[
			'--input-type=module',
			'--eval',
			"const {verifyPackageRuntime}=await import('./dist/runtime-check.js'); console.log(await verifyPackageRuntime());"
		],
		{ cwd: consumerRoot }
	);
	assert.match(builtRuntime.stdout, /formeBytes/);
	await run(vite, ['build', '--ssr', 'src/docs-runtime.ts'], {
		cwd: consumerRoot
	});
	const docsRuntime = await run(
		nodeCommand,
		[
			'--input-type=module',
			'--eval',
			"const {verifyDocs}=await import('./dist/docs-runtime.js'); console.log(await verifyDocs());"
		],
		{ cwd: consumerRoot }
	);
	console.log(
		`Shown docs source: ${displayedSourceCount} files typechecked; three endpoints and both copied-source invoice graphs rendered after production build:`,
		docsRuntime.stdout.trim()
	);

	// Exercise the actual browser entry separately from server-only Forme/PDF rendering.
	await writeFile(
		join(consumerRoot, 'src', 'App.svelte'),
		`<script>import { Text, Graph } from 'pdfcn-svelte/bases/takumi';</script>\n<Text>Browser-only component</Text>\n<Graph data={[{ label: 'Browser', value: 1 }]} />\n`
	);
	const browserBuild = await run(vite, ['build'], { cwd: consumerRoot });
	assert.doesNotMatch(
		browserBuild.stderr + browserBuild.stdout,
		/externalized for browser compatibility|node:fs|node:async_hooks/,
		'browser component imports must not traverse Node renderer modules'
	);
	const browserAssets = await readdir(join(consumerRoot, 'dist', 'assets'));
	assert.ok(
		!browserAssets.some((name) => name.endsWith('.wasm')),
		'browser component build must not emit renderer Wasm'
	);

	// The themes subpath is JavaScript-only, so it should also work in native
	// Node without a Svelte-aware loader. Component-bearing subpaths are checked
	// through the consumer's Vite SSR pipeline below.
	await run(
		nodeCommand,
		[
			'--input-type=module',
			'--eval',
			"const themes = await import('pdfcn-svelte/themes'); if (themes.THEME_NAMES.length !== 9 || themes.getTheme('modern')?.theme !== themes.modernTheme) process.exit(1);"
		],
		{ cwd: consumerRoot }
	);

	const runtimeResult = await run(nodeCommand, ['./runtime-runner.mjs'], {
		cwd: consumerRoot
	});
	const runtimeLine = runtimeResult.stdout.trim().split(/\r?\n/).at(-1);
	const runtime = JSON.parse(runtimeLine);
	assert.ok(runtime.formeBytes > 1_000, 'expected a non-trivial Forme PDF');
	assert.ok(runtime.takumiBytes > 1_000, 'expected a non-trivial Takumi PDF');

	const elapsedSeconds = ((performance.now() - startedAt) / 1000).toFixed(1);
	console.log(
		`Fresh consumer contract passed in ${elapsedSeconds}s: typecheck, SSR production build, browser build without renderer assets, all public subpaths, Forme ${runtime.formeBytes} bytes, Takumi ${runtime.takumiBytes} bytes.`
	);
} finally {
	await rm(temporaryRoot, { recursive: true, force: true });
}
