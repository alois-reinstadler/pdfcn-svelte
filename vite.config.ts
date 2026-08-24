import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	// takumi-pdf initializes its WASM module with top-level await.
	optimizeDeps: { esbuildOptions: { target: 'esnext' } },
	build: { target: 'esnext' }
});
