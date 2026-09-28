<script lang="ts">
	import { professionalTheme } from '$lib/themes';
	import { InvoiceModern, type InvoiceModernData } from '$lib/bases/forme';
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
	const data: InvoiceModernData = {
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
		items: Array.from({ length: 40 }, (_, index) => ({
			description: `Service ${String(index + 1).padStart(2, '0')} — Implementation, documentation and review of the supplied requirements.`,
			quantity: 1,
			unitPrice: 150
		})),
		// Supplied by the caller: 40 × 150 = 6000; 20% VAT = 1200.
		summary: { subtotal: 6000, tax: 1200, total: 7200 },
		paymentTerms: {
			dueDate: '5 October 2026',
			method: 'Bank transfer',
			gst: 'ATU00000000'
		},
		notes: 'Include INV-2026-01 with your payment.'
	};
</script>

<InvoiceModern {data} {theme} />
