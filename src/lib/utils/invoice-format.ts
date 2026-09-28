/** Amounts are supplied by the caller; this helper only formats them. */
export interface InvoiceFormatOptions {
	/** ISO 4217 currency code. @default 'USD' */
	currency?: string;
	/** Intl locale. @default 'en-US' (matches the shipped invoice samples) */
	locale?: string;
	/** Label for the supplied tax amount. @default 'Tax' */
	taxLabel?: string;
}

export function invoiceFormatter(options: InvoiceFormatOptions): (amount: number) => string {
	const formatter = new Intl.NumberFormat(options.locale ?? 'en-US', {
		style: 'currency', currency: options.currency ?? 'USD'
	});
	return (amount) => {
		if (!Number.isFinite(amount)) throw new Error('Invoice amounts must be finite numbers. Supply calculated totals and line amounts; NaN and Infinity cannot be printed as money.');
		return formatter.format(amount);
	};
}
