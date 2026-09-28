<script lang="ts">
 import { Document, Page, Heading, KeepTogether, Watermark, PdfImage, PrintableForm, PrintableSignature, List, Graph } from '$lib/bases/takumi';
 import PdfcnThemeProvider from '$lib/PdfcnThemeProvider.svelte';
 let { kind, options = {} }: { kind: string; options?: Record<string, any> } = $props();
</script>
<PdfcnThemeProvider><Document><Page flow margin={40}>
 {#if kind === 'heading'}<Heading {...options}>Heading</Heading>
 {:else if kind === 'keep'}<KeepTogether {...options}><Heading>Kept heading</Heading></KeepTogether>
 {:else if kind === 'watermark'}<Watermark text="DRAFT" {...options} />
 {:else if kind === 'image'}<PdfImage src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=" {...options} />
 {:else if kind === 'form'}<PrintableForm groups={[{ fields: [{label: 'Field width', width: 120, height: 25}] }]} {...options} />
 {:else if kind === 'signature'}<PrintableSignature {...options} />
 {:else if kind === 'list'}<List variant="numbered" items={[{text:'Parent',description:'Description preserved',children:[{text:'Nested preserved'}]}]} {...options} />
 {:else if kind === 'graph'}<Graph data={[{label:'Alpha',value:7},{label:'Beta',value:0}]} {...options} />{/if}
</Page></Document></PdfcnThemeProvider>
