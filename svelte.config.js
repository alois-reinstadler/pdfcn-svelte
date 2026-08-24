import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const base = process.env.PDFCN_BASE_PATH ?? '';

if (base && !base.startsWith('/')) {
	throw new Error('PDFCN_BASE_PATH must be empty or start with a slash.');
}

export default {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({ fallback: '404.html' }),
		paths: { base },
		alias: {
			$docs: './src/docs'
		},
		files: {
			assets: 'public'
		}
	}
};
