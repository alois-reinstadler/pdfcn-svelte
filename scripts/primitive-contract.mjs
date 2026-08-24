import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

import { createServer } from 'vite';

const root = fileURLToPath(new URL('..', import.meta.url));
const server = await createServer({
	root,
	optimizeDeps: { noDiscovery: true },
	server: { middlewareMode: true },
	appType: 'custom'
});

try {
	const [
		forme,
		formeApi,
		formePrimitives,
		FormeMaybeFixedDocument,
		rootApi,
		svelteServer,
		TakumiNativePropsDocument,
		themes
	] = await Promise.all([
		server.ssrLoadModule('@formepdf/svelte'),
		server.ssrLoadModule('/src/lib/bases/forme/index.ts'),
		server.ssrLoadModule('/src/lib/bases/forme/lib/pdf-primitives.ts'),
		server
			.ssrLoadModule('/tests/primitives/forme-maybe-fixed.svelte')
			.then((module) => module.default),
		server.ssrLoadModule('/src/lib/index.ts'),
		server.ssrLoadModule('svelte/server'),
		server
			.ssrLoadModule('/tests/primitives/takumi-native-props.svelte')
			.then((module) => module.default),
		server.ssrLoadModule('/src/lib/themes/index.ts')
	]);

	assert.equal(formePrimitives.mergeFormeStyles(), undefined);
	assert.equal(
		formePrimitives.mergeFormeStyles(false, null, undefined, [], [false, [{}]]),
		undefined
	);
	assert.deepEqual(
		formePrimitives.mergeFormeStyles(
			{ color: '#111111', paddingTop: 2 },
			[false, [{ color: '#222222' }]],
			null
		),
		{ color: '#222222', paddingTop: 2 }
	);

	assert.equal(typeof formeApi.MaybeFixed, 'function');
	assert.equal(formeApi.THEME_COLOR_KEYS, rootApi.THEME_COLOR_KEYS);
	assert.deepEqual(rootApi.THEME_COLOR_KEYS, [
		'foreground',
		'background',
		'muted',
		'mutedForeground',
		'primary',
		'primaryForeground',
		'border',
		'accent',
		'destructive',
		'success',
		'warning',
		'info'
	]);

	assert.deepEqual(themes.THEME_NAMES, [
		'blueprint',
		'corporate',
		'elegant',
		'executive',
		'forest',
		'minimal',
		'modern',
		'professional',
		'vivid'
	]);
	assert.equal(themes.THEMES.length, Object.keys(themes.themePresets).length);
	assert.equal(themes.getTheme('professional')?.theme, themes.professionalTheme);
	assert.equal(themes.getTheme('professional')?.title, 'Professional');

	const serialized = await forme.serialize(FormeMaybeFixedDocument);
	const formeSource = JSON.stringify(serialized);
	assert.match(formeSource, /Fixed header/);
	assert.match(formeSource, /Inline footer/);
	assert.match(formeSource, /"type":"Fixed"/);

	const { body: html } = svelteServer.render(TakumiNativePropsDocument);
	assert.match(html, /class="view-alias"/);
	assert.match(html, /id="view-id"/);
	assert.match(html, /data-contract="view"/);
	assert.match(html, /aria-label="View primitive"/);
	assert.match(html, /class="text-alias"/);
	assert.match(html, /id="text-id"/);
	assert.match(html, /rel="noreferrer"/);
	assert.match(html, /class="image-alias"/);
	assert.match(html, /loading="lazy"/);
	assert.match(html, /class="link-alias"/);
	assert.match(html, /data-contract="link"/);
	assert.match(html, /class="svelte-class"/);
	assert.match(html, /Svelte class alias/);

	console.log('Primitive contracts: Forme styles/MaybeFixed, themes, and Takumi native props passed.');
} finally {
	await server.close();
}
