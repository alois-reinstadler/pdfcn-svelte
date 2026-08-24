import InvoiceClassic from './components/TemplateInvoiceClassicPreview.svelte';
import InvoiceConsultant from '$lib/bases/takumi/blocks/invoice-consultant/invoice-consultant.svelte';
import InvoiceCorporate from './components/TemplateInvoiceCorporatePreview.svelte';
import InvoiceCreative from '$lib/bases/takumi/blocks/invoice-creative/invoice-creative.svelte';
import InvoiceMinimal from '$lib/bases/takumi/blocks/invoice-minimal/invoice-minimal.svelte';
import InvoiceModern from '$lib/bases/takumi/blocks/invoice-modern/invoice-modern.svelte';
import FinancialReport from '$lib/bases/takumi/blocks/report-financial/report-financial.svelte';
import MarketingReport from '$lib/bases/takumi/blocks/report-marketing/report-marketing.svelte';
import OperationsReport from '$lib/bases/takumi/blocks/report-operations/report-operations.svelte';
import SecurityReport from '$lib/bases/takumi/blocks/report-security/report-security.svelte';

/**
 * Security boundary for the public preview route. Route parameters are never turned
 * into import paths; only these ten audited components can be instantiated.
 */
export const takumiTemplateAllowlist = {
	'invoice-classic': InvoiceClassic,
	'invoice-consultant': InvoiceConsultant,
	'invoice-corporate': InvoiceCorporate,
	'invoice-creative': InvoiceCreative,
	'invoice-minimal': InvoiceMinimal,
	'invoice-modern': InvoiceModern,
	'report-financial': FinancialReport,
	'report-marketing': MarketingReport,
	'report-operations': OperationsReport,
	'report-security': SecurityReport
} as const;

export type TakumiPreviewSlug = keyof typeof takumiTemplateAllowlist;

export function isTakumiPreviewSlug(slug: string): slug is TakumiPreviewSlug {
	return Object.hasOwn(takumiTemplateAllowlist, slug);
}
