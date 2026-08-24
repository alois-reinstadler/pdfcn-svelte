import { createServer } from 'vite';

const server = await createServer({
	root: process.cwd(),
	server: { middlewareMode: true },
	appType: 'custom'
});

try {
	const contract = await server.ssrLoadModule('/src/runtime-check.ts');
	const result = await contract.verifyPackageRuntime();
	process.stdout.write(`${JSON.stringify(result)}\n`);
} finally {
	await server.close();
}
