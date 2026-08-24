<script lang="ts">
	import PdfcnThemeProvider from '$lib/PdfcnThemeProvider.svelte';
	import type { PdfcnTheme } from '$lib/types/pdf-themes';

	import InvoiceClassicContent from './invoice-classic-content.svelte';
	import type { InvoiceClassicData } from './invoice-classic.types';

	const sampleData: InvoiceClassicData = {
		billTo: { address: '456 Client Ave, Suite 2', email: 'contact@clientcorp.com', name: 'Client Corp.', phone: '+1 (555) 123-4567' },
		companyAddress: 'Nagpur, IN', companyEmail: 'hello@pdfcn.app', companyName: 'pdfcn',
		dueDate: 'March 17, 2026', invoiceDate: 'February 17, 2026', invoiceNumber: 'INV-2026-001',
		items: [
			{ description: 'Web Development', quantity: 1, unitPrice: 12_500 },
			{ description: 'UI/UX Design', quantity: 1, unitPrice: 8750 },
			{ description: 'Consulting', quantity: 10, unitPrice: 1500 }
		],
		logo: '/favicon.svg', notes: 'Thank you for your business!',
		paymentTerms: { dueDate: 'March 17, 2026', gst: 'GSTIN 123456789', method: 'UPI / Card / Bank Transfer' },
		subtitle: 'Innovative PDF Solutions', summary: { subtotal: 36_250, tax: 2537.5, total: 38_787.5 }
	};

	let { theme, data = sampleData }: { theme?: PdfcnTheme; data?: InvoiceClassicData } = $props();
</script>

<PdfcnThemeProvider {theme}><InvoiceClassicContent {data} /></PdfcnThemeProvider>
