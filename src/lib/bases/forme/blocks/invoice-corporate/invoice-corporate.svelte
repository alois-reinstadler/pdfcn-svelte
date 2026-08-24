<script lang="ts">
	import PdfcnThemeProvider from '$lib/PdfcnThemeProvider.svelte';
	import type { PdfcnTheme } from '$lib/types/pdf-themes';

	import InvoiceCorporateContent from './invoice-corporate-content.svelte';
	import type { InvoiceCorporateData } from './invoice-corporate.types';

	const sampleData: InvoiceCorporateData = {
		billTo: { address: '100 Corporate Plaza, Tower B', email: 'accounts@globalindustries.com', name: 'Global Industries Ltd.', phone: '+1 (555) 888-9999' },
		companyAddress: 'Nagpur, IN', companyEmail: 'hello@pdfcn.app', companyName: 'pdfcn',
		dueDate: 'March 24, 2026', invoiceDate: 'February 22, 2026', invoiceNumber: 'INV-2026-004',
		items: [
			{ description: 'Enterprise Software License', quantity: 5, unitPrice: 4500 },
			{ description: 'Implementation Services', quantity: 1, unitPrice: 18_000 },
			{ description: 'Training Workshop (per session)', quantity: 3, unitPrice: 2500 },
			{ description: 'Annual Support Package', quantity: 1, unitPrice: 8500 }
		],
		logo: '/favicon.svg', notes: 'Corporate billing – Net 30 terms apply. For inquiries, contact accounts@pdfcn.app',
		paymentTerms: { dueDate: 'March 24, 2026', gst: 'GSTIN 987654321', method: 'Wire Transfer / Corporate Account' },
		subtitle: 'Innovative PDF Solutions', summary: { subtotal: 56_500, tax: 4520, total: 61_020 }
	};

	let { theme, data = sampleData }: { theme?: PdfcnTheme; data?: InvoiceCorporateData } = $props();
</script>

<PdfcnThemeProvider {theme}><InvoiceCorporateContent {data} /></PdfcnThemeProvider>
