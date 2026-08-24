<script lang="ts">
	import { base } from '$app/paths';
	import CodeBlock from '../../../docs/components/CodeBlock.svelte';
	import DocPage from '../../../docs/components/DocPage.svelte';

	const themes = [
		{ name: 'Professional', color: '#334155', paper: '#f8fafc' },
		{ name: 'Modern', color: '#2563eb', paper: '#eff6ff' },
		{ name: 'Corporate', color: '#1e3a5f', paper: '#f1f5f9' },
		{ name: 'Minimal', color: '#18181b', paper: '#fafafa' },
		{ name: 'Elegant', color: '#7c3f58', paper: '#fdf2f5' },
		{ name: 'Executive', color: '#695228', paper: '#fbf8ef' },
		{ name: 'Blueprint', color: '#075985', paper: '#f0f9ff' },
		{ name: 'Forest', color: '#286145', paper: '#f0f7f2' },
		{ name: 'Vivid', color: '#9333ea', paper: '#faf5ff' }
	];
	const usage = `import { PdfcnThemeProvider } from 'pdfcn-svelte';
import { forestTheme } from 'pdfcn-svelte/themes';

<PdfcnThemeProvider theme={forestTheme}>
  <!-- your document tree -->
</PdfcnThemeProvider>`;
</script>

<svelte:head><title>Themes — pdfcn / svelte</title></svelte:head>

<DocPage title="Theme the whole document" description="Themes are renderer-neutral semantic tokens for document color, typography, spacing, radii, borders, and component treatment. Every component resolves the same vocabulary through Svelte context.">
	<h2>Nine included presets</h2>
	<div class="theme-grid">
		{#each themes as theme}
			<div style={`--swatch: ${theme.color}; --sheet: ${theme.paper}`}><span class="swatch"></span><section><i></i><b></b><b></b><b></b></section><strong>{theme.name}</strong></div>
		{/each}
	</div>

	<h2>Apply a preset</h2>
	<CodeBlock code={usage} label="Document.svelte" />
	<p>Without a provider, components use <code>professionalTheme</code>. The provider captures its theme at component initialization; if your application needs to swap presets dynamically, recreate the provider subtree.</p>

	<p>Theme tokens only name typefaces; PDF renderers still need the matching font files. See the <a href={`${base}/docs/fonts`}>font registration guide</a> for Forme, Takumi, deterministic self-hosting, and licensing guidance.</p>

	<h2>Semantic colors</h2>
	<p>Component color props resolve semantic names such as <code>foreground</code>, <code>mutedForeground</code>, <code>primary</code>, <code>success</code>, <code>warning</code>, and <code>destructive</code>. This keeps a document coherent when its preset changes.</p>
	<div class="token-row"><span class="foreground">foreground</span><span class="primary">primary</span><span class="success">success</span><span class="warning">warning</span><span class="danger">destructive</span></div>

	<h2>Custom themes</h2>
	<p>The exported <code>PdfcnTheme</code> types and shared primitives are the contract for custom themes. Start with an included preset or the shared primitives, preserve its complete token shape, and override semantic decisions for your brand.</p>
</DocPage>

<style>
	.theme-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.65rem; }
	.theme-grid > div { display: grid; padding: 0.65rem; grid-template-columns: auto 1fr; gap: 0.65rem; border: 1px solid var(--line); border-radius: 0.55rem; background: var(--paper); }
	.swatch { width: 0.75rem; border-radius: 0.25rem; background: var(--swatch); }
	.theme-grid section { display: grid; height: 5rem; padding: 0.8rem; align-content: start; gap: 0.38rem; background: var(--sheet); }
	.theme-grid section i { width: 1.2rem; height: 1.2rem; margin-bottom: 0.25rem; border-radius: 50%; background: var(--swatch); }
	.theme-grid section b { display: block; width: 100%; height: 0.18rem; background: color-mix(in srgb, var(--swatch) 40%, transparent); }.theme-grid section b:last-child { width: 65%; }
	.theme-grid strong { grid-column: 1 / -1; padding: 0.15rem; font-size: 0.68rem; }
	.token-row { display: flex; flex-wrap: wrap; gap: 0.5rem; }
	.token-row span { padding: 0.42rem 0.6rem; border-radius: 999px; color: white; font-family: var(--font-mono); font-size: 0.57rem; }
	.foreground { background: #334155; }.primary { background: #2563eb; }.success { background: #168052; }.warning { background: #b7791f; }.danger { background: #c13939; }
	@media (max-width: 600px) { .theme-grid { grid-template-columns: 1fr 1fr; } }
</style>
