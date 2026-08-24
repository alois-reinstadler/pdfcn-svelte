import { access, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LIB_DIR = path.join(ROOT, 'src/lib');
const BASES_DIR = path.join(LIB_DIR, 'bases');
const THEMES_DIR = path.join(LIB_DIR, 'themes');
const OUTPUT_DIR = path.join(ROOT, 'public/r');
const REGISTRY_PATH = path.join(ROOT, 'registry.json');

const REGISTRY_SCHEMA = 'https://shadcn-svelte.com/schema/registry.json';
const ITEM_SCHEMA = 'https://shadcn-svelte.com/schema/registry-item.json';
const SOURCE_EXTENSIONS = new Set(['.svelte', '.ts', '.js', '.css']);

const CORE_FILES = [
	'src/lib/PdfcnThemeProvider.svelte',
	'src/lib/theme-provider.svelte.ts',
	'src/lib/types/pdf-components.ts',
	'src/lib/types/pdf-themes.ts',
	'src/lib/utils/resolve-color.ts',
	'src/lib/themes/primitives.ts',
	'src/lib/themes/professional.ts'
];

const titleOverrides = new Map([
	['data-table', 'Data Table'],
	['keep-together', 'Keep Together'],
	['key-value', 'Key Value'],
	['page-break', 'Page Break'],
	['page-footer', 'Page Footer'],
	['page-header', 'Page Header'],
	['page-number', 'Page Number'],
	['pdf-image', 'PDF Image'],
	['qrcode', 'QR Code']
]);

const baseDependencies = new Map([
	['forme', ['@formepdf/core', '@formepdf/svelte']],
	['takumi', ['@takumi-rs/helpers', 'takumi-pdf']]
]);

function toPosix(value) {
	return value.split(path.sep).join('/');
}

function relativeToRoot(absolutePath) {
	return toPosix(path.relative(ROOT, absolutePath));
}

function humanize(name) {
	if (titleOverrides.has(name)) return titleOverrides.get(name);
	return name
		.split('-')
		.map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
		.join(' ');
}

async function exists(filePath) {
	try {
		await access(filePath);
		return true;
	} catch {
		return false;
	}
}

async function childDirectories(directory) {
	if (!(await exists(directory))) return [];
	return (await readdir(directory, { withFileTypes: true }))
		.filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
		.map((entry) => entry.name)
		.sort();
}

async function sourceFiles(directory) {
	if (!(await exists(directory))) return [];
	const entries = await readdir(directory, { withFileTypes: true });
	const files = [];
	for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
		const entryPath = path.join(directory, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await sourceFiles(entryPath)));
		} else if (entry.isFile() && SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
			files.push(entryPath);
		}
	}
	return files;
}

function registryFile(filePath, type, content) {
	const sourcePath = relativeToRoot(filePath);
	return {
		path: sourcePath,
		...(content === undefined ? {} : { content }),
		type,
		// Root-relative targets preserve the $lib imports used by the source even
		// when a consumer has customized its shadcn-svelte component alias.
		target: `~/${sourcePath}`
	};
}

function barePackage(specifier) {
	if (
		specifier.startsWith('.') ||
		specifier.startsWith('/') ||
		specifier.startsWith('$lib/') ||
		specifier === 'svelte' ||
		specifier.startsWith('svelte/')
	) {
		return null;
	}
	if (specifier.startsWith('@')) return specifier.split('/').slice(0, 2).join('/');
	return specifier.split('/')[0];
}

function importsFrom(content) {
	const imports = [];
	const expression = /(?:from\s*|import\s*\()\s*['"]([^'"]+)['"]/g;
	for (const match of content.matchAll(expression)) imports.push(match[1]);
	return imports;
}

async function dependenciesFor(files) {
	const dependencies = new Set();
	for (const file of files) {
		const content = await readFile(file, 'utf8');
		for (const specifier of importsFrom(content)) {
			const packageName = barePackage(specifier);
			if (packageName) dependencies.add(packageName);
		}
	}
	return [...dependencies].sort();
}

function referencedComponents(base, filesWithContent, ownName) {
	const dependencies = new Set();
	const absolutePrefix = `$lib/bases/${base}/components/`;
	for (const { absolutePath, content } of filesWithContent) {
		for (const specifier of importsFrom(content)) {
			let component;
			if (specifier.startsWith(absolutePrefix)) {
				component = specifier.slice(absolutePrefix.length).split('/')[0];
			} else if (specifier.startsWith('.')) {
				const resolved = path.resolve(path.dirname(absolutePath), specifier);
				const relative = toPosix(path.relative(path.join(BASES_DIR, base, 'components'), resolved));
				if (!relative.startsWith('../')) component = relative.split('/')[0];
			}
			if (component && component !== ownName) dependencies.add(component);
		}
	}
	return [...dependencies].sort();
}

async function materializeFiles(files, type) {
	return Promise.all(
		files.map(async (file) => {
			const content = await readFile(file, 'utf8');
			return {
				absolutePath: file,
				content,
				file: registryFile(file, type, content)
			};
		})
	);
}

function sourceFilesOnly(item) {
	const { $schema: _schema, ...sourceItem } = item;
	return {
		...sourceItem,
		files: item.files.map(({ content: _content, ...file }) => file)
	};
}

function outputFilesOnly(item) {
	return {
		...item,
		files: item.files.map(({ path: _path, ...file }) => file)
	};
}

function outputDependency(base, name) {
	return `./${name}.json`;
}

async function buildUtilsItem(base) {
	const baseLib = await sourceFiles(path.join(BASES_DIR, base, 'lib'));
	const coreFiles = [];
	for (const relativePath of CORE_FILES) {
		const absolutePath = path.join(ROOT, relativePath);
		if (!(await exists(absolutePath))) {
			throw new Error(`Required registry infrastructure is missing: ${relativePath}`);
		}
		coreFiles.push(absolutePath);
	}
	const files = [...coreFiles, ...baseLib].sort((left, right) =>
		relativeToRoot(left).localeCompare(relativeToRoot(right))
	);
	const materialized = await materializeFiles(files, 'registry:lib');
	return {
		$schema: ITEM_SCHEMA,
		name: `${base}/utils`,
		title: `${humanize(base)} PDF Utilities`,
		description: `Shared theme context, types, color helpers, and PDF primitives for the ${base} base.`,
		dependencies: [...new Set([...(baseDependencies.get(base) ?? []), ...(await dependenciesFor(files))])].sort(),
		registryDependencies: [],
		files: materialized.map(({ file }) => file),
		type: 'registry:lib'
	};
}

async function buildDirectoryItem(base, kind, name) {
	const type = kind === 'blocks' ? 'registry:block' : 'registry:component';
	const directory = path.join(BASES_DIR, base, kind, name);
	const files = await sourceFiles(directory);
	if (files.length === 0) return null;
	const materialized = await materializeFiles(files, type);
	const componentDependencies = referencedComponents(base, materialized, name);
	const registryDependencies = [outputDependency(base, 'utils')];
	for (const dependency of componentDependencies) {
		registryDependencies.push(outputDependency(base, dependency));
	}
	const dependencies = await dependenciesFor(files);
	if (name === 'qrcode') dependencies.push('@types/qrcode');
	return {
		$schema: ITEM_SCHEMA,
		name: `${base}/${name}`,
		title: humanize(name),
		description:
			kind === 'blocks'
				? `${humanize(name)} PDF document block for the ${base} base.`
				: `${humanize(name)} PDF component for the ${base} base.`,
		dependencies: [...new Set(dependencies)].sort(),
		registryDependencies: [...new Set(registryDependencies)].sort(),
		files: materialized.map(({ file }) => file),
		type: kind === 'blocks' ? 'registry:block' : 'registry:ui'
	};
}

async function buildThemeItem(base, themeName) {
	const themeFile = path.join(THEMES_DIR, `${themeName}.ts`);
	const content = await readFile(themeFile, 'utf8');
	return {
		$schema: ITEM_SCHEMA,
		name: `${base}/theme-${themeName}`,
		title: `${humanize(themeName)} Theme (${humanize(base)})`,
		description: `${humanize(themeName)} PDF theme tokens for the ${base} base.`,
		dependencies: [],
		registryDependencies: [outputDependency(base, 'utils')],
		files: [registryFile(themeFile, 'registry:theme', content)],
		type: 'registry:theme'
	};
}

function assertRegistry(registry, outputItems) {
	if (registry.$schema !== REGISTRY_SCHEMA) throw new Error('Invalid registry schema URL.');
	if (!registry.name || !registry.homepage || !Array.isArray(registry.items)) {
		throw new Error('Registry must have a name, homepage, and items array.');
	}
	const names = new Set();
	for (const item of outputItems) {
		if (names.has(item.name)) throw new Error(`Duplicate registry item: ${item.name}`);
		names.add(item.name);
		if (!item.name || !item.type || !Array.isArray(item.registryDependencies) || item.files.length === 0) {
			throw new Error(`Incomplete registry item: ${item.name || '<unnamed>'}`);
		}
		for (const file of item.files) {
			if (!file.path || !file.target || !file.type || typeof file.content !== 'string') {
				throw new Error(`Invalid file entry in ${item.name}: ${file.path || '<unnamed>'}`);
			}
			if (!file.target.startsWith('~/src/lib/')) {
				throw new Error(`Unsafe registry target in ${item.name}: ${file.target}`);
			}
		}
	}
	for (const item of outputItems) {
		for (const dependency of item.registryDependencies) {
			const dependencyName = dependency.replace(/^\.\//, '').replace(/\.json$/, '');
			if (!names.has(`${item.name.split('/')[0]}/${dependencyName}`)) {
				throw new Error(`Missing registry dependency for ${item.name}: ${dependency}`);
			}
		}
	}
}

async function main() {
	const bases = await childDirectories(BASES_DIR);
	if (bases.length === 0) throw new Error('No PDF bases found in src/lib/bases.');
	const themeNames = (await readdir(THEMES_DIR, { withFileTypes: true }))
		.filter(
			(entry) =>
				entry.isFile() &&
				entry.name.endsWith('.ts') &&
				!['index.ts', 'primitives.ts'].includes(entry.name)
		)
		.map((entry) => entry.name.slice(0, -3))
		.sort();

	const outputItems = [];
	for (const base of bases) {
		outputItems.push(await buildUtilsItem(base));
		for (const kind of ['components', 'blocks']) {
			for (const name of await childDirectories(path.join(BASES_DIR, base, kind))) {
				const item = await buildDirectoryItem(base, kind, name);
				if (item) outputItems.push(item);
			}
		}
		for (const themeName of themeNames) outputItems.push(await buildThemeItem(base, themeName));
	}
	outputItems.sort((left, right) => left.name.localeCompare(right.name));

	const registry = {
		$schema: REGISTRY_SCHEMA,
		name: 'pdfcn-svelte',
		homepage: 'http://localhost:5173',
		aliases: {
			components: '$lib/components',
			lib: '$lib',
			ui: '$lib/components/ui',
			utils: '$lib/utils'
		},
		items: outputItems.map(sourceFilesOnly)
	};
	assertRegistry(registry, outputItems);
	const publishedItems = outputItems.map(outputFilesOnly);

	await rm(OUTPUT_DIR, { force: true, recursive: true });
	await mkdir(OUTPUT_DIR, { recursive: true });
	await writeFile(REGISTRY_PATH, `${JSON.stringify(registry, null, 2)}\n`);
	await writeFile(path.join(OUTPUT_DIR, 'registry.json'), `${JSON.stringify(registry, null, 2)}\n`);
	for (const item of publishedItems) {
		const [base, itemName] = item.name.split('/');
		const directory = path.join(OUTPUT_DIR, base);
		await mkdir(directory, { recursive: true });
		await writeFile(path.join(directory, `${itemName}.json`), `${JSON.stringify(item, null, 2)}\n`);
	}

	const componentCount = outputItems.filter((item) => item.type === 'registry:ui').length;
	const blockCount = outputItems.filter((item) => item.type === 'registry:block').length;
	const themeCount = outputItems.filter((item) => item.type === 'registry:theme').length;
	console.log(
		`Built ${outputItems.length} registry items (${componentCount} components, ${blockCount} blocks, ${themeCount} themes) across ${bases.length} bases.`
	);
}

await main();
