import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [svelte()],
	optimizeDeps: {
		esbuildOptions: { target: 'esnext' }
	},
	build: { target: 'esnext' }
});
