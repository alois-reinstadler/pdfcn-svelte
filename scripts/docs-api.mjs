import { readFile, readdir, writeFile } from 'node:fs/promises';
import ts from 'typescript';

// Extract declarations and runtime defaults, rather than maintaining a second API by hand.
export async function collectApi() {
	const result = {};
	for (const base of ['forme', 'takumi']) {
		result[base] = {};
		const root = `src/lib/bases/${base}/components`;
		for (const slug of (await readdir(root)).sort()) {
			const sources = (await readdir(`${root}/${slug}`))
				.filter(
					(name) => name.endsWith('.svelte') || name.endsWith('.types.ts')
				)
				.sort();
			const declarations = [],
				defaults = [];
			for (const name of sources) {
				const raw = await readFile(`${root}/${slug}/${name}`, 'utf8');
				const source = name.endsWith('.svelte')
					? [...raw.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)]
							.map((m) => m[1])
							.join('\n')
					: raw;
				const file = ts.createSourceFile(
					name + '.ts',
					source,
					ts.ScriptTarget.Latest,
					true
				);
				for (const node of file.statements) {
					if (
						ts.isInterfaceDeclaration(node) ||
						ts.isTypeAliasDeclaration(node)
					) {
						if (
							['DarkModule', 'VariantDefaults', 'ChartLayout'].includes(
								node.name.text
							)
						)
							continue;
						declarations.push(
							node.getFullText(file).trim().replace(/^\t/gm, '')
						);
					}
					if (ts.isVariableStatement(node))
						for (const declaration of node.declarationList.declarations) {
							if (declaration.initializer?.getText(file) === '$props()')
								defaults.push(
									`// ${name}\n${declaration.getText(file).replace(/^\t/gm, '')}`
								);
						}
				}
			}
			// Base props are shown explicitly, including inherited children and style.
			result[base][slug] = {
				declarations: [...new Set(declarations)].join('\n\n'),
				defaults: defaults.join('\n\n')
			};
		}
	}
	return JSON.stringify(result, null, 2) + '\n';
}
const generated = await collectApi();
const target = 'src/docs/component-api.json';
if (process.argv.includes('--check')) {
	if ((await readFile(target, 'utf8')) !== generated)
		throw new Error('API reference drifted. Run pnpm run docs:api.');
} else await writeFile(target, generated);
