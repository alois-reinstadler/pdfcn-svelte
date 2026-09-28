<script lang="ts">
 import { base } from '$app/paths';
 import pages from '../pdf-pages.json';
 type Artifact = { pdf: string; pages: { image: string; width: number; height: number; text: string }[] };
 let { artifact, title }: { artifact: string; title: string } = $props();
 const document = $derived((pages as Record<string, Artifact>)[artifact]);
 let selection = $state({ artifact: '', index: 0 });
 const index = $derived(selection.artifact === artifact ? Math.min(selection.index, (document?.pages.length ?? 1) - 1) : 0);
 const current = $derived(document?.pages[index]);
 function select(index: number) { selection = { artifact, index }; }
</script>

{#if document && current}
 <div class="pdf-pages" aria-label={`${title} physical PDF pages`}>
  <div class="controls">
   <button type="button" disabled={index === 0} onclick={() => select(index - 1)} aria-label="Previous PDF page">Previous</button>
   <span role="status" aria-live="polite">Page {index + 1} of {document.pages.length}</span>
   <button type="button" disabled={index === document.pages.length - 1} onclick={() => select(index + 1)} aria-label="Next PDF page">Next</button>
  </div>
  <p class="caption">Actual PDF output. Select a page, or <a href={`${base}${document.pdf}`} target="_blank" rel="noreferrer">open the complete PDF</a>.</p>
  <a class="page" href={`${base}${current.image}`} target="_blank" rel="noreferrer" aria-label={`Open ${title}, page ${index + 1}, at full size`}>
   <img src={`${base}${current.image}`} width={current.width} height={current.height} alt={`${title}, physical PDF page ${index + 1} of ${document.pages.length}. Text available below.`} loading="lazy" />
  </a>
  <details><summary>Page {index + 1} text</summary><p class="page-text">{current.text}</p></details>
 </div>
{/if}

<style>
 .pdf-pages { min-width: 0; margin: 1.5rem 0; padding: 1rem; border: 1px solid var(--line); border-radius: 0.6rem; background: var(--paper-deep); }
 .controls { display: flex; gap: 0.75rem; align-items: center; justify-content: space-between; }
 .controls span { font-size: 0.9rem; font-variant-numeric: tabular-nums; }
 button { min-height: 44px; padding: 0.5rem 0.75rem; border: 1px solid var(--line); border-radius: 0.3rem; background: var(--paper); color: var(--ink); cursor: pointer; }
 button:disabled { opacity: 0.45; cursor: default; }
 .caption { margin: 0.8rem 0; font-size: 0.8rem; line-height: 1.6; }
 a { color: var(--green-dark); }
 .page { display: block; margin: auto; max-width: 60rem; }
 img { display: block; width: 100%; height: auto; background: white; box-shadow: 0 2px 10px #0002; }
 details { margin-top: 1rem; }
 summary { cursor: pointer; }
 .page-text { font-size: 0.9rem; line-height: 1.7; overflow-wrap: anywhere; }
 :is(a, button, summary):focus-visible { outline: 3px solid var(--green); outline-offset: 3px; }
 @media (max-width: 480px) { .pdf-pages { padding: 0.6rem; } .controls { gap: 0.3rem; } }
</style>
