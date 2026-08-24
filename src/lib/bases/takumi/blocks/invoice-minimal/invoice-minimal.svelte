<script lang="ts">
	import PdfcnThemeProvider from '$lib/PdfcnThemeProvider.svelte';
	import type { PdfcnTheme } from '$lib/types/pdf-themes';

	import InvoiceMinimalContent from './invoice-minimal-content.svelte';
	import type { InvoiceMinimalData } from './invoice-minimal.types';

	const sampleData: InvoiceMinimalData = {
		billTo: { address: '500 Enterprise Way, Building A', email: 'finance@enterprisecorp.io', name: 'Enterprise Corp', phone: '+1 (555) 246-8135' },
		companyAddress: 'Nagpur, IN', companyEmail: 'hello@pdfcn.app', companyName: 'pdfcn',
		dueDate: 'March 22, 2026', invoiceDate: 'February 20, 2026', invoiceNumber: 'INV-2026-003',
		items: [
			{ description: 'Annual License Plan', quantity: 1, unitPrice: 25_000 },
			{ description: 'Support & Maintenance', quantity: 12, unitPrice: 1500 },
			{ description: 'Custom Integration', quantity: 1, unitPrice: 12_000 }
		],
		notes: 'Invoice for annual enterprise subscription. Please retain for your records.',
		paymentTerms: { dueDate: 'March 22, 2026', gst: 'GSTIN 123456789', method: 'ACH Transfer / Check' },
		subtitle: 'Innovative PDF Solutions', summary: { subtotal: 55_000, tax: 3850, total: 58_850 }
	};

	let { theme, data = sampleData }: { theme?: PdfcnTheme; data?: InvoiceMinimalData } = $props();
</script>

<PdfcnThemeProvider {theme}><InvoiceMinimalContent {data} /></PdfcnThemeProvider>
