<script lang="ts">
	import Callout from '../../../docs/components/Callout.svelte';
	import CodeBlock from '../../../docs/components/CodeBlock.svelte';
	import DocPage from '../../../docs/components/DocPage.svelte';

	const basePrimitives = ['Document', 'Page', 'View', 'PDFText', 'PDFLink', 'Image'];
	const svgPrimitives = ['Svg', 'G', 'Path', 'Rect', 'Circle', 'Line', 'SvgText'];
	const use = `import { Document, Page, View, PDFText } from 'pdfcn-svelte/bases/forme';

<Document title=\"Raw primitives\">
  <Page size=\"A4\" margin={36}>
    <View style={{ padding: 12 }}>
      <PDFText>Renderer-native content</PDFText>
    </View>
  </Page>
</Document>`;
</script>

<svelte:head><title>Primitives — pdfcn / svelte</title></svelte:head>

<DocPage title="Renderer primitives" description="The low-level exports sit beneath the themed component layer. Use them to fill a layout gap, create a new component, or author custom SVG content without leaving the selected renderer tree.">
	<h2>Document primitives</h2>
	<div class="chips">{#each basePrimitives as primitive}<span>{primitive}</span>{/each}</div>
	<p>Both bases export Document, Page, View, text, link, and image wrappers. Public aliases such as <code>PDFText</code> and <code>PDFLink</code> distinguish the primitive from the themed Text and Link components.</p>
	<CodeBlock code={use} label="PrimitiveDocument.svelte" />

	<h2>SVG primitives</h2>
	<div class="chips svg">{#each svgPrimitives as primitive}<span>{primitive}</span>{/each}</div>
	<p>The graph component uses the same renderer-safe SVG layer available to your own components. Attribute normalization keeps common SVG properties consistent across the Forme and Takumi implementations.</p>

	<h2>Base-specific helpers</h2>
	<div class="helper-grid"><section><small>FORME</small><strong>Native document instructions</strong><p>Forme additionally exposes Fixed, MaybeFixed, StyleSheet, page-number tokens, PDFPageBreak, PDFWatermark, and style merging helpers.</p></section><section><small>TAKUMI</small><strong>CSS and PDF adapter</strong><p>Takumi exposes point-to-pixel conversion, style flattening, CSS serialization, pagination contexts, and the server-only renderDocument adapter.</p></section></div>

	<Callout title="Primitives are base-specific"><p>Identical names do not make the underlying components interchangeable. Import raw primitives and higher-level components from the same renderer namespace.</p></Callout>

	<h2>When to use a component instead</h2>
	<p>Prefer the 24 themed components for common document UI. They already resolve semantic theme tokens, normalize variants, and encode cross-renderer conventions. Reach for primitives when you are intentionally building the next reusable component.</p>
</DocPage>

<style>
	.chips { display: flex; flex-wrap: wrap; gap: 0.5rem; }
	.chips span { padding: 0.5rem 0.65rem; border: 1px solid #b8d6c6; border-radius: 0.4rem; background: var(--green-wash); color: var(--green-dark); font-family: var(--font-mono); font-size: 0.64rem; font-weight: 700; }
	.chips.svg span { border-color: var(--line); background: var(--paper); color: var(--copy); }
	.helper-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem; }
	.helper-grid section { padding: 1.1rem; border: 1px solid var(--line); border-radius: 0.55rem; background: var(--paper); }
	.helper-grid small { color: var(--green); font-family: var(--font-mono); font-size: 0.52rem; letter-spacing: 0.1em; }
	.helper-grid strong { display: block; margin-top: 0.7rem; font-size: 0.78rem; }
	.helper-grid p { margin: 0.4rem 0 0; color: var(--muted); font-size: 0.68rem; line-height: 1.55; }
	@media (max-width: 560px) { .helper-grid { grid-template-columns: 1fr; } }
</style>
