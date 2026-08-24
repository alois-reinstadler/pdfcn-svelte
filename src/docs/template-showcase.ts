import type { ThemePresetName } from '$lib/themes';

export type DocumentTemplate = {
	slug: string;
	name: string;
	kind: 'Invoice' | 'Report';
	tone: string;
	description: string;
	longDescription: string;
	theme: ThemePresetName;
	components: readonly string[];
	bestFor: readonly string[];
};

export const documentTemplates = [
	{
		slug: 'invoice-classic', name: 'Classic Invoice', kind: 'Invoice', tone: 'Timeless', theme: 'professional',
		description: 'A familiar, balanced invoice for everyday billing.',
		longDescription: 'A dependable billing layout with a branded header, clear client details, an itemized table, payment terms, and a compact total. It is intentionally neutral enough to work across industries.',
		components: ['PageHeader', 'Section', 'Table', 'KeyValue', 'Text', 'PageFooter'],
		bestFor: ['Small businesses', 'Recurring services', 'General billing']
	},
	{
		slug: 'invoice-consultant', name: 'Consultant Invoice', kind: 'Invoice', tone: 'Editorial', theme: 'elegant',
		description: 'A service-led layout for time, projects, and retainers.',
		longDescription: 'Designed around professional services, this template makes the consultant and client relationship prominent and prices work by hours and rate. Project references and payment notes remain easy to scan.',
		components: ['Heading', 'Section', 'Table', 'KeyValue', 'Divider', 'Text', 'PageFooter'],
		bestFor: ['Independent consultants', 'Agencies', 'Time-based engagements']
	},
	{
		slug: 'invoice-corporate', name: 'Corporate Invoice', kind: 'Invoice', tone: 'Formal', theme: 'corporate',
		description: 'A structured invoice for established organizations.',
		longDescription: 'A denser enterprise-ready layout for purchase workflows, formal billing contacts, tax details, and larger item lists. Strong information hierarchy helps finance teams process it quickly.',
		components: ['PageHeader', 'Badge', 'Section', 'Table', 'KeyValue', 'Text', 'PageFooter'],
		bestFor: ['Enterprise vendors', 'Procurement workflows', 'Formal accounts']
	},
	{
		slug: 'invoice-creative', name: 'Creative Invoice', kind: 'Invoice', tone: 'Expressive', theme: 'vivid',
		description: 'A high-character layout for studios and independents.',
		longDescription: 'Bold accents and an asymmetric rhythm give creative work a distinctive finish without compromising billing clarity. It suits project fees, asset packages, and usage-rights notes.',
		components: ['Heading', 'Badge', 'Stack', 'Section', 'Table', 'KeyValue', 'Text', 'PageFooter'],
		bestFor: ['Design studios', 'Freelancers', 'Creative production']
	},
	{
		slug: 'invoice-minimal', name: 'Minimal Invoice', kind: 'Invoice', tone: 'Quiet', theme: 'minimal',
		description: 'A calm, restrained invoice with generous whitespace.',
		longDescription: 'This low-ink invoice strips billing down to the essentials. Spacious composition and fine rules keep attention on the work, recipient, and amount due.',
		components: ['Heading', 'Stack', 'Divider', 'Table', 'KeyValue', 'Text', 'PageFooter'],
		bestFor: ['Premium services', 'Solo businesses', 'Print-conscious billing']
	},
	{
		slug: 'invoice-modern', name: 'Modern Invoice', kind: 'Invoice', tone: 'Contemporary', theme: 'modern',
		description: 'A crisp billing document with clear visual hierarchy.',
		longDescription: 'A product-minded invoice with confident typography, compact metadata, and a highlighted amount due. It is a strong default for technology and digital service businesses.',
		components: ['PageHeader', 'Section', 'Table', 'KeyValue', 'Text', 'PageFooter'],
		bestFor: ['SaaS companies', 'Digital agencies', 'Product studios']
	},
	{
		slug: 'report-financial', name: 'Financial Report', kind: 'Report', tone: 'Analytical', theme: 'executive',
		description: 'Executive metrics, performance data, and tables.',
		longDescription: 'An executive summary for revenue, margin, operating expense, and runway. Metrics, trend visualization, ownership tables, and written highlights turn structured data into a board-ready narrative.',
		components: ['PageHeader', 'Badge', 'Card', 'Graph', 'DataTable', 'List', 'PageFooter'],
		bestFor: ['Board updates', 'Quarterly reviews', 'Finance leadership']
	},
	{
		slug: 'report-marketing', name: 'Marketing Report', kind: 'Report', tone: 'Energetic', theme: 'vivid',
		description: 'Campaign outcomes, channel metrics, and narrative.',
		longDescription: 'A campaign report that combines acquisition metrics, channel health, weekly pipeline output, and narrative takeaways. It balances a colorful visual story with operational detail.',
		components: ['PageHeader', 'Badge', 'Card', 'Graph', 'DataTable', 'List', 'PageFooter'],
		bestFor: ['Campaign reviews', 'Client reporting', 'Growth teams']
	},
	{
		slug: 'report-operations', name: 'Operations Report', kind: 'Report', tone: 'Practical', theme: 'blueprint',
		description: 'Operational health, throughput, and next actions.',
		longDescription: 'A working report for delivery health, SLA performance, backlogs, and workstream status. The horizontal comparison chart makes team progress legible at a glance.',
		components: ['PageHeader', 'Alert', 'Card', 'Graph', 'DataTable', 'List', 'PageFooter'],
		bestFor: ['Monthly operations', 'Service delivery', 'Leadership reviews']
	},
	{
		slug: 'report-security', name: 'Security Report', kind: 'Report', tone: 'Technical', theme: 'forest',
		description: 'Risk posture, findings, and remediation priorities.',
		longDescription: 'A security posture brief for vulnerabilities, patch SLAs, open findings, and control maturity. Risk distribution and status styling focus attention without turning the report into an alarm panel.',
		components: ['PageHeader', 'Alert', 'Badge', 'Card', 'Graph', 'DataTable', 'List', 'PageFooter'],
		bestFor: ['Security leadership', 'Audit preparation', 'Risk committees']
	}
] as const satisfies readonly DocumentTemplate[];

export type TemplateSlug = (typeof documentTemplates)[number]['slug'];

export const templateSlugs = documentTemplates.map((template) => template.slug) as TemplateSlug[];

export function getDocumentTemplate(slug: string): DocumentTemplate | undefined {
	return documentTemplates.find((template) => template.slug === slug);
}

export const documentRecipes = [
	{ name: 'Account statement', description: 'Transactions, aging, totals, and payment instructions.', components: ['PageHeader', 'DataTable', 'KeyValue', 'PageFooter'] },
	{ name: 'Project proposal', description: 'Scope, milestones, pricing options, and signature approval.', components: ['Heading', 'Section', 'Card', 'List', 'Signature'] },
	{ name: 'Audit pack', description: 'Findings, severity summaries, evidence links, and remediation owners.', components: ['Alert', 'Badge', 'DataTable', 'QRCode', 'PageFooter'] },
	{ name: 'Certificate', description: 'A branded one-page award with recipient and validation details.', components: ['Watermark', 'Heading', 'Divider', 'Signature', 'QRCode'] },
	{ name: 'Product brief', description: 'Feature comparison, performance graphs, and implementation notes.', components: ['Card', 'Graph', 'Table', 'List', 'PdfImage'] },
	{ name: 'Inspection report', description: 'Site metadata, checklists, photographic evidence, and sign-off.', components: ['Form', 'List', 'PdfImage', 'Signature', 'PageNumber'] }
] as const;
