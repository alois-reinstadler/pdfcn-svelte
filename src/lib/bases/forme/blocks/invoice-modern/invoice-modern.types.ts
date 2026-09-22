import type { InvoiceFormatOptions } from '$lib/utils/invoice-format';

export interface InvoiceModernData extends InvoiceFormatOptions {
	invoiceNumber: string;
	invoiceDate: string;
	dueDate: string;
	companyName: string;
	subtitle: string;
	companyAddress: string;
	companyEmail: string;
	billTo: { name: string; address: string; email: string; phone: string };
	items: { description: string; quantity: number; unitPrice: number }[];
	summary: { subtotal: number; tax: number; total: number };
	paymentTerms: { dueDate: string; method: string; gst: string };
	notes?: string;
}
