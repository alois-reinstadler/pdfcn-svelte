<script lang="ts">
	import Callout from '../../../docs/components/Callout.svelte';
	import DocPage from '../../../docs/components/DocPage.svelte';
</script>

<svelte:head><title>Renderers — pdfcn / svelte</title></svelte:head>

<DocPage title="Two renderer bases" description="Forme and Takumi expose the same document vocabulary, but they solve different parts of the rendering pipeline. The distinction is architectural—not a theme or runtime toggle.">
	<div class="compare">
		<div id="forme"><span class="icon">F</span><small>PDF PIPELINE</small><h2>Forme</h2><p>Components produce a Forme document tree. The official <code>@formepdf/svelte</code> adapter can serialize it and, with <code>@formepdf/core</code>, render PDF bytes.</p><ul><li>Real PDF-byte output</li><li>Server or local generation</li><li>Native pagination semantics</li></ul></div>
		<div id="takumi"><span class="icon alt">T</span><small>HTML → PDF PIPELINE</small><h2>Takumi</h2><p>Components produce HTML/CSS-compatible Svelte markup. The included server adapter SSRs that tree and passes it to the official <code>takumi-pdf</code> engine.</p><ul><li>Real PDF-byte output</li><li>Browser-visible preview tree</li><li>Overflow-aware pagination</li></ul></div>
	</div>

	<Callout title="Server-side adapter"><p><code>renderTakumiDocument</code> lazily imports <code>svelte/server</code> and <code>takumi-pdf</code>, keeping normal browser imports safe while PDF rendering remains a server or build-time operation.</p></Callout>

	<h2>Feature comparison</h2>
	<div class="table-wrap"><table><thead><tr><th>Capability</th><th>Forme</th><th>Takumi</th></tr></thead><tbody>
		<tr><td>24 themed components</td><td>Yes</td><td>Yes</td></tr>
		<tr><td>10 document templates</td><td>Yes</td><td>Yes</td></tr>
		<tr><td>Produces PDF bytes here</td><td>Yes</td><td>Yes</td></tr>
		<tr><td>Browser-visible HTML/CSS</td><td>No</td><td>Yes</td></tr>
		<tr><td>Renderer dependency</td><td>@formepdf/*</td><td>takumi-pdf</td></tr>
		<tr><td>SVG primitives</td><td>Yes</td><td>Yes</td></tr>
	</tbody></table></div>

	<h2>How to choose</h2>
	<p>Choose Forme when you want its native Svelte document model and renderer semantics. Choose Takumi when browser-visible HTML/CSS previews and an HTML-to-paged-PDF pipeline fit your application. Both now return PDF bytes inside this repository.</p>
	<p>The component source is duplicated by base on purpose. That makes output behavior explicit and lets copied registry items bring only the primitives their renderer needs.</p>
</DocPage>

<style>
	.compare { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
	.compare > div { padding: 1.3rem; scroll-margin-top: 6rem; border: 1px solid var(--line); border-radius: 0.65rem; background: var(--paper); }
	.icon { display: grid; width: 2.7rem; height: 2.7rem; margin-bottom: 1.3rem; place-items: center; border-radius: 0.5rem; background: var(--green); color: white; font-family: Georgia, serif; font-style: italic; }
	.icon.alt { background: var(--acid); color: var(--ink); }
	.compare small { color: var(--faint); font-family: var(--font-mono); font-size: 0.52rem; letter-spacing: 0.11em; }
	.compare h2 { margin: 0.3rem 0 0.5rem; font-size: 1.45rem; }
	.compare p, .compare li { font-size: 0.72rem; }
	.compare ul { padding-left: 1rem; }
	.table-wrap { overflow-x: auto; border: 1px solid var(--line); border-radius: 0.55rem; }
	table { width: 100%; border-collapse: collapse; background: var(--paper); font-size: 0.75rem; }
	th, td { padding: 0.8rem 1rem; border-bottom: 1px solid var(--line); text-align: left; }
	th { color: var(--faint); font-family: var(--font-mono); font-size: 0.54rem; letter-spacing: 0.08em; text-transform: uppercase; }
	tr:last-child td { border-bottom: 0; }
	@media (max-width: 600px) { .compare { grid-template-columns: 1fr; } }
</style>
