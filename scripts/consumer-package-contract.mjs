import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { cp, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

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
		import('node:fs/promises').then(({ mkdir }) => mkdir(packRoot, { recursive: true })),
		import('node:fs/promises').then(({ mkdir }) => mkdir(consumerRoot, { recursive: true }))
	]);

	// Build first so this contract can be run independently of the rest of the
	// validation pipeline and always exercises the current source tree.
	await run(pnpmCommand, ['--silent', 'run', 'package']);
	await run(pnpmCommand, ['--silent', 'pack', '--pack-destination', packRoot]);

	const tarballs = (await readdir(packRoot)).filter((name) => name.endsWith('.tgz'));
	assert.equal(tarballs.length, 1, `expected one package tarball, found ${tarballs.length}`);
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
			'takumi-pdf': rootPackage.peerDependencies['takumi-pdf']
		},
		devDependencies: {
			'@sveltejs/vite-plugin-svelte': rootPackage.devDependencies['@sveltejs/vite-plugin-svelte'],
			'@types/node': rootPackage.devDependencies['@types/node'],
			'svelte-check': rootPackage.devDependencies['svelte-check'],
			typescript: rootPackage.devDependencies.typescript,
			vite: rootPackage.devDependencies.vite
		}
	};

	await Promise.all([
		writeFile(join(consumerRoot, 'package.json'), `${JSON.stringify(consumerPackage, null, 2)}\n`),
		cp(fixtureRoot, consumerRoot, { recursive: true })
	]);

	await run(pnpmCommand, ['install', '--prefer-offline', '--no-lockfile'], {
		cwd: consumerRoot
	});

	const svelteCheck = join(
		consumerRoot,
		'node_modules',
		'.bin',
		process.platform === 'win32' ? 'svelte-check.cmd' : 'svelte-check'
	);
	await run(svelteCheck, ['--tsconfig', './tsconfig.json'], { cwd: consumerRoot });

	const vite = join(
		consumerRoot,
		'node_modules',
		'.bin',
		process.platform === 'win32' ? 'vite.cmd' : 'vite'
	);
	// PDF renderers are server-side dependencies (Forme ships Wasm and Takumi
	// reads native assets), so the relevant production compilation contract is
	// an SSR build. svelte-check above still validates the browser-facing sample.
	await run(vite, ['build', '--ssr', 'src/runtime-check.ts'], { cwd: consumerRoot });

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
		`Fresh consumer contract passed in ${elapsedSeconds}s: typecheck, SSR production build, all four public subpaths, Forme ${runtime.formeBytes} bytes, Takumi ${runtime.takumiBytes} bytes.`
	);
} finally {
	await rm(temporaryRoot, { recursive: true, force: true });
}
