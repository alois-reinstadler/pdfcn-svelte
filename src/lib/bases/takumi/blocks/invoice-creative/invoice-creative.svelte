<script lang="ts">
	import PdfcnThemeProvider from '$lib/PdfcnThemeProvider.svelte';
	import type { PdfcnTheme } from '$lib/types/pdf-themes';

	import InvoiceCreativeContent from './invoice-creative-content.svelte';
	import type { InvoiceCreativeData } from './invoice-creative.types';

	const sampleData: InvoiceCreativeData = {
		billTo: { address: '250 Design District, Loft 5', email: 'studio@creativeagency.co', name: 'Creative Agency Co.', phone: '+1 (555) 321-7654' },
		companyAddress: 'Nagpur, IN · hello@pdfcn.app', companyName: 'pdfcn',
		dueDate: 'March 26, 2026', invoiceDate: 'February 24, 2026', invoiceNumber: 'INV-2026-005',
		items: [
			{ description: 'Brand Identity Design', quantity: 1, unitPrice: 8500 },
			{ description: 'Marketing Collateral Package', quantity: 1, unitPrice: 4200 },
			{ description: 'Social Media Assets (per set)', quantity: 4, unitPrice: 750 },
			{ description: 'Motion Graphics (30s)', quantity: 2, unitPrice: 3500 }
		],
		notes: 'Creative work is protected under copyright. Full usage rights transfer upon payment.',
		paymentTerms: { dueDate: 'March 26, 2026', gst: 'GSTIN 456789123', method: 'Credit Card / PayPal / Stripe' },
		subtitle: 'Innovative PDF Solutions', summary: { subtotal: 22_700, tax: 1475.5, total: 24_175.5 }
	};

	let { theme, data = sampleData }: { theme?: PdfcnTheme; data?: InvoiceCreativeData } = $props();
</script>

<PdfcnThemeProvider {theme}><InvoiceCreativeContent {data} /></PdfcnThemeProvider>
