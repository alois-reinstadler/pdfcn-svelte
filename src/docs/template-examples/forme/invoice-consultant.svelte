<script lang="ts">
	import { professionalTheme } from '$lib/themes';
	import {
		InvoiceConsultant,
		type InvoiceConsultantData
	} from '$lib/bases/forme';
	// Built-in Helvetica avoids a network font dependency in this example.
	const theme = {
		...professionalTheme,
		typography: {
			...professionalTheme.typography,
			body: { ...professionalTheme.typography.body, fontFamily: 'Helvetica' },
			heading: {
				...professionalTheme.typography.heading,
				fontFamily: 'Helvetica'
			}
		}
	};
	const data: InvoiceConsultantData = {
		invoiceNumber: 'INV-2026-01',
		invoiceDate: '21 September 2026',
		dueDate: '5 October 2026',
		companyName: 'Acme Studio',
		subtitle: 'Design services',
		companyAddress: 'Vienna, Austria',
		currency: 'EUR',
		locale: 'de-AT',
		taxLabel: 'VAT (20%)',
		consultant: {
			name: 'Alex Morgan',
			title: 'Consultant',
			email: 'alex@example.com'
		},
		client: {
			name: 'Ada Lovelace',
			company: 'Analytical Studio',
			address: 'Vienna, Austria',
			email: 'ada@example.com'
		},
		services: [
			{
				description: 'Design consultation and delivery review',
				hours: 2,
				rate: 150
			}
		],
		// Caller-owned totals: 2 × 150 = 300; 20% VAT = 60.
		summary: { totalHours: 2, subtotal: 300, tax: 60, total: 360 },
		paymentTerms: { dueDate: '5 October 2026', method: 'Bank transfer' },
		notes: 'Include INV-2026-01 with your payment.'
	};
</script>

<InvoiceConsultant {data} {theme} />
