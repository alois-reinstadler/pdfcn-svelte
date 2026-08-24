<script lang="ts">
	import PdfcnThemeProvider from '$lib/PdfcnThemeProvider.svelte';
	import type { PdfcnTheme } from '$lib/types/pdf-themes';

	import InvoiceModernContent from './invoice-modern-content.svelte';
	import type { InvoiceModernData } from './invoice-modern.types';

	const sampleData: InvoiceModernData = {
		billTo: { address: '789 Innovation Blvd, Floor 3', email: 'billing@techstart.com', name: 'TechStart Solutions', phone: '+1 (555) 987-6543' },
		companyAddress: 'Nagpur, IN', companyEmail: 'hello@pdfcn.app', companyName: 'pdfcn',
		dueDate: 'March 20, 2026', invoiceDate: 'February 18, 2026', invoiceNumber: 'INV-2026-002',
		items: [
			{ description: 'API Integration', quantity: 1, unitPrice: 15_000 },
			{ description: 'SEO', quantity: 2, unitPrice: 5500 },
			{ description: 'Security Audit', quantity: 1, unitPrice: 7200 }
		],
		notes: 'Payment terms: Net 30 days. Thank you for your business!',
		paymentTerms: { dueDate: 'March 20, 2026', gst: 'GSTIN 123456789', method: 'Wire Transfer / Bank Account' },
		subtitle: 'Innovative PDF Solutions', summary: { subtotal: 33_200, tax: 2324, total: 35_524 }
	};

	let { theme, data = sampleData }: { theme?: PdfcnTheme; data?: InvoiceModernData } = $props();
</script>

<PdfcnThemeProvider {theme}><InvoiceModernContent {data} /></PdfcnThemeProvider>
