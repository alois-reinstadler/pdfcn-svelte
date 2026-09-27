<script lang="ts">
 import { Document, Page, PageHeader, PageFooter, PageNumber, PDFPageBreak, Text, Fixed } from '$lib/bases/forme';
 import PdfcnThemeProvider from '$lib/PdfcnThemeProvider.svelte';
 let { late = false, kind = 'footer', flow = false, rawBreakFirst = false }: {late?: boolean; kind?: 'header'|'footer'|'number'|'fixed'; flow?: boolean; rawBreakFirst?: boolean} = $props();
</script>
{#snippet repeated()}
 {#if kind === 'header'}<PageHeader fixed title="REPEATED HEADER" />
 {:else if kind === 'footer'}<PageFooter fixed leftText="REPEATED FOOTER" />
 {:else if kind === 'number'}<PageNumber fixed format={'Page {page} of {total}'} />
 {:else}<Fixed position="footer"><Text>REPEATED RAW FIXED</Text></Fixed>{/if}
{/snippet}
<PdfcnThemeProvider><Document><Page size="A5" margin={30}>
 {#if rawBreakFirst}<PDFPageBreak />{/if}
 {#if !late}{@render repeated()}{/if}
 <Text>FIRST CONTENT</Text>
 {#if flow}{#each Array.from({length:45}) as _, i}<Text>BODY LINE {i+1} — full content preserved</Text>{/each}
 {:else}<PDFPageBreak /><Text>SECOND CONTENT</Text>{/if}
 {#if late}{@render repeated()}{/if}
</Page></Document></PdfcnThemeProvider>
