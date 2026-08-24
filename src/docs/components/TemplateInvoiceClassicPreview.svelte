<script lang="ts">
	import InvoiceClassic from '$lib/bases/takumi/blocks/invoice-classic/invoice-classic.svelte';
	import type { InvoiceClassicData } from '$lib/bases/takumi/blocks/invoice-classic/invoice-classic.types';
	import type { PdfcnTheme } from '$lib/types/pdf-themes';

	let { theme }: { theme?: PdfcnTheme } = $props();
	const data: InvoiceClassicData = {
		billTo: { address: '456 Client Ave, Suite 2', email: 'contact@clientcorp.com', name: 'Client Corp.', phone: '+1 (555) 123-4567' },
		companyAddress: 'Nagpur, IN', companyEmail: 'hello@pdfcn.app', companyName: 'pdfcn',
		dueDate: 'March 17, 2026', invoiceDate: 'February 17, 2026', invoiceNumber: 'INV-2026-001',
		items: [
			{ description: 'Web Development', quantity: 1, unitPrice: 12_500 },
			{ description: 'UI/UX Design', quantity: 1, unitPrice: 8750 },
			{ description: 'Consulting', quantity: 10, unitPrice: 1500 }
		],
		notes: 'Thank you for your business!',
		paymentTerms: { dueDate: 'March 17, 2026', gst: 'GSTIN 123456789', method: 'UPI / Card / Bank Transfer' },
		subtitle: 'Innovative PDF Solutions', summary: { subtotal: 36_250, tax: 2537.5, total: 38_787.5 }
	};
</script>

<InvoiceClassic {theme} {data} />
