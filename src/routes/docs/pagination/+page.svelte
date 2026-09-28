<script lang="ts">
 import { base } from '$app/paths';
 import CodeBlock from '../../../docs/components/CodeBlock.svelte';
 import DocPage from '../../../docs/components/DocPage.svelte';
 import PdfPages from '../../../docs/components/PdfPages.svelte';
 import { packageSource } from '../../../docs/package-source.mjs';
 const sources = import.meta.glob('../../../docs/pagination-examples/*/*.svelte', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;
 let renderer = $state<'forme' | 'takumi'>('takumi');
 const source = $derived(packageSource(sources[`../../../docs/pagination-examples/${renderer}/invoice.svelte`]));
</script>

<svelte:head><title>Physical PDF pages — pdfcn / svelte</title></svelte:head>
<DocPage title="Follow the physical pages." description="A forty-line invoice with wrapped descriptions, repeated footers and a final total. These images are rendered from the generated PDF, so the page boundaries are real.">
 <div class="renderers" aria-label="Pagination example renderer">
  <button type="button" aria-pressed={renderer === 'takumi'} onclick={() => renderer = 'takumi'}>Takumi</button>
  <button type="button" aria-pressed={renderer === 'forme'} onclick={() => renderer = 'forme'}>Forme</button>
 </div>
 <PdfPages artifact={`pagination/${renderer}/invoice`} title={`${renderer} long invoice`} />
 <h2>What to inspect</h2>
 <p>Follow Service 01 through Service 40. Each physical page has its own page number and footer. The last page contains the caller-supplied total of EUR 7.200,00. Different engines can wrap text and break pages differently.</p>
 <h2>Reproduce this output</h2>
 <p>Follow <a href={`${base}/docs/getting-started`}>Getting started</a>, then replace <code>src/lib/Example.svelte</code> with this complete file. Use the endpoint for the selected renderer. No external font or image downloads are needed.</p>
 <CodeBlock code={source} label="src/lib/Example.svelte" />
 <p>For component-specific behavior, see <a href={`${base}/components/page-header`}>repeated headers</a>, <a href={`${base}/components/keep-together`}>keeping content together</a> and <a href={`${base}/components/page-break`}>explicit page breaks</a>. Their examples also show actual PDF pages.</p>
</DocPage>
<style>
 .renderers { display: flex; gap: 0.5rem; }
 button { padding: 0.7rem 1rem; border: 1px solid var(--line); border-radius: 0.4rem; background: var(--paper); color: var(--ink); cursor: pointer; }
 button[aria-pressed='true'] { background: var(--green); color: white; }
 button:focus-visible { outline: 3px solid var(--green); outline-offset: 3px; }
</style>
