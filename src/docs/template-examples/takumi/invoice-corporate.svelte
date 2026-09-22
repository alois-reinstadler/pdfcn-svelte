<script lang="ts">
	import { professionalTheme } from '$lib/themes';
	import {
		InvoiceCorporate,
		type InvoiceCorporateData
	} from '$lib/bases/takumi';
	// Built-in sans-serif fallback avoids a network font dependency in this example.
	const theme = {
		...professionalTheme,
		typography: {
			...professionalTheme.typography,
			body: { ...professionalTheme.typography.body, fontFamily: 'sans-serif' },
			heading: {
				...professionalTheme.typography.heading,
				fontFamily: 'sans-serif'
			}
		}
	};
	const data: InvoiceCorporateData = {
		invoiceNumber: 'INV-2026-01',
		invoiceDate: '21 September 2026',
		dueDate: '5 October 2026',
		companyName: 'Acme Studio',
		subtitle: 'Design services',
		companyAddress: 'Vienna, Austria',
		companyEmail: 'hello@example.com',
		currency: 'EUR',
		locale: 'de-AT',
		taxLabel: 'VAT (20%)',
		billTo: {
			name: 'Ada Lovelace',
			address: 'Vienna, Austria',
			email: 'ada@example.com',
			phone: '+43 1 555 0100'
		},
		items: [
			{
				description: 'Design consultation and delivery review',
				quantity: 2,
				unitPrice: 150
			}
		],
		// Caller-owned totals: 2 × 150 = 300; 20% VAT = 60.
		summary: { subtotal: 300, tax: 60, total: 360 },
		paymentTerms: {
			dueDate: '5 October 2026',
			method: 'Bank transfer',
			gst: 'ATU00000000'
		},
		notes: 'Include INV-2026-01 with your payment.'
	};
</script>

<InvoiceCorporate {data} {theme} />
