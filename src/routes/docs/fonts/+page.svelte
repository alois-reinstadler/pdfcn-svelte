<script lang="ts">
	import Callout from '../../../docs/components/Callout.svelte';
	import CodeBlock from '../../../docs/components/CodeBlock.svelte';
	import DocPage from '../../../docs/components/DocPage.svelte';

	const forme = `import { Font } from '@formepdf/svelte';

Font.register({
  family: 'Inter',
  src: './fonts/Inter-Regular.ttf'
});

Font.register({
  family: 'Inter',
  src: './fonts/Inter-Bold.ttf',
  fontWeight: 'bold'
});`;

	const takumi = `import { googleFonts } from '@takumi-rs/helpers';
import { renderDocument } from 'pdfcn-svelte/bases/takumi';
import Invoice from './Invoice.svelte';

const fonts = await googleFonts(['Inter']);
const pdf = await renderDocument(Invoice, {
  fonts,
  fontFamilies: ['Inter', 'sans-serif']
});`;
</script>

<svelte:head>
	<title>Fonts — pdfcn / svelte</title>
	<meta name="description" content="Register and embed fonts for Forme and Takumi PDF documents." />
</svelte:head>

<DocPage title="Fonts are renderer resources." description="A pdfcn theme selects font-family names. Your PDF renderer still needs the matching font files so it can shape, subset, and embed those glyphs.">
	<Callout title="Why an unregistered font looks wrong" tone="warning"><p>A browser may already have a requested font, but a server-side PDF renderer usually does not. If a theme asks for Inter, Lato, or Merriweather without loading that face, the engine must fall back. Register every family and weight your document uses.</p></Callout>

	<h2>Forme</h2>
	<p>Register TrueType faces with <code>Font.register</code> from <code>@formepdf/svelte</code>. Forme subsets the registered files into the PDF. A font source may be a path, data URL, or byte array.</p>
	<CodeBlock code={forme} label="fonts.ts" />

	<h2>Takumi</h2>
	<p>Pass fonts through the renderer options. The official helper can resolve Google Fonts, or you can provide your own URL or bytes. An explicit fallback chain also makes missing-glyph behavior predictable.</p>
	<CodeBlock code={takumi} label="render-invoice.ts" />

	<h2>Shipping fonts responsibly</h2>
	<ul>
		<li>Self-host production fonts when deterministic builds and privacy matter.</li>
		<li>Load regular, medium, semibold, bold, and italic faces only when the template uses them.</li>
		<li>Check the font license permits embedding and redistribution.</li>
		<li>Include a Unicode-capable fallback for multilingual documents.</li>
	</ul>

	<p>The checked-in showcase PDFs use a renderer-safe sans-serif override so previews remain consistent without redistributing third-party font files. This does not mutate the nine public theme presets.</p>
</DocPage>
