<script lang="ts">
 import { Document, Page, DataTable } from '$lib/bases/forme';
 import PdfcnThemeProvider from '$lib/PdfcnThemeProvider.svelte';
 let { description = 'Readable row' }: { description?: string } = $props();
</script>
<PdfcnThemeProvider><Document><Page size="A4" margin={40}>
<DataTable columns={[{ key: 'description', header: 'Description', width: '55%' }, { key: 'quantity', header: 'Quantity', width: '15%' }, { key: 'rate', header: 'Unit Price', width: '15%' }, { key: 'amount', header: 'Amount', width: '15%' }]} data={[{ description, amount: '100.00', quantity: 1, rate: 100 },{ description: 'Second row', amount: '200.00', quantity: 2, rate: 100 }]} />
</Page></Document></PdfcnThemeProvider>
