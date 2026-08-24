<script lang="ts">
	import Callout from '../../../docs/components/Callout.svelte';
	import CodeBlock from '../../../docs/components/CodeBlock.svelte';
	import DocPage from '../../../docs/components/DocPage.svelte';

	const imports = `import { PdfcnThemeProvider } from 'pdfcn-svelte';
import { modernTheme } from 'pdfcn-svelte/themes';
import { Document, Page, Heading, Text } from 'pdfcn-svelte/bases/forme';`;
	const document = [
		'<PdfcnThemeProvider theme={modernTheme}>',
		'  <Document title=\"Account summary\" author=\"Acme, Inc.\">',
		'    <Page size=\"A4\" margin={48}>',
		'      <Heading level={1}>Account summary</Heading>',
		'      <Text color=\"mutedForeground\">Prepared for Ada Lovelace</Text>',
		'    </Page>',
		'  </Document>',
		'</PdfcnThemeProvider>'
	].join('\n');
	const componentImport = ['im', "port AccountSummary from '$lib/AccountSummary.svelte';"].join('');
	const endpoint = `import { renderDocument } from '@formepdf/svelte';
${componentImport}

export async function GET() {
  const pdf = await renderDocument(AccountSummary);
  return new Response(pdf, { headers: { 'content-type': 'application/pdf' } });
}`;
</script>

<svelte:head><title>Getting started — pdfcn / svelte</title></svelte:head>

<DocPage title="Your first document" description="A document is an ordinary Svelte component built from one renderer namespace. Both bases can render PDF bytes; this first example uses Forme.">
	<h2>1. Choose a renderer base</h2>
	<p>Use <code>pdfcn-svelte/bases/forme</code> for Forme-native document instructions. Use <code>pdfcn-svelte/bases/takumi</code> when you also want an inspectable HTML/CSS preview; its server adapter passes that markup to <code>takumi-pdf</code> for real PDF bytes.</p>
	<Callout title="Keep one base per tree"><p>Forme and Takumi components share names and themes, but their underlying output semantics differ. Do not mix their primitives inside the same document.</p></Callout>

	<h2>2. Import a theme and components</h2>
	<CodeBlock code={imports} label="AccountSummary.svelte" />
	<p>The theme provider uses Svelte context. Components without a provider fall back to the Professional preset.</p>

	<h2>3. Compose the document</h2>
	<CodeBlock code={document} label="AccountSummary.svelte" />
	<p>Build up from <code>Document</code> and <code>Page</code>. Higher-level components such as Stack, Section, Table, and PageFooter handle the recurring patterns while still accepting renderer-native style overrides.</p>

	<h2>4. Render PDF bytes</h2>
	<CodeBlock code={endpoint} label="src/routes/account.pdf/+server.ts" />
	<p>The official <code>@formepdf/svelte</code> adapter serializes the component and the Forme core produces the PDF. This is typically done in a SvelteKit server route.</p>
	<Callout title="Rendering with Takumi"><p>Import <code>renderDocument</code> from <code>pdfcn-svelte/bases/takumi</code> and pass it a Takumi document component. The adapter SSRs the Svelte tree and renders the resulting HTML with <code>takumi-pdf</code>.</p></Callout>

	<div class="next"><small>NEXT</small><a href="/docs/renderers">Understand the renderer tradeoffs <span>→</span></a></div>
</DocPage>

<style>
	.next { display: grid; margin-top: 3rem; padding: 1rem 0; gap: 0.35rem; border-top: 1px solid var(--line); }
	.next small { color: var(--faint); font-family: var(--font-mono); font-size: 0.52rem; letter-spacing: 0.12em; }
	.next a { display: flex; justify-content: space-between; color: var(--ink); font-size: 0.84rem; text-decoration: none; }
</style>
