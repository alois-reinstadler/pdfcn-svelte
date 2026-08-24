import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const root = resolve(new URL('..', import.meta.url).pathname);
const missing = [];

for (const [subpath, target] of Object.entries(packageJson.exports ?? {})) {
	for (const [condition, relativePath] of Object.entries(target)) {
		try {
			await access(resolve(root, relativePath));
		} catch {
			missing.push(`${subpath} (${condition}) -> ${relativePath}`);
		}
	}
}

if (missing.length > 0) {
	throw new Error(`Missing declared package export targets:\n${missing.join('\n')}`);
}

console.log(`Validated ${Object.keys(packageJson.exports).length} package export maps.`);
