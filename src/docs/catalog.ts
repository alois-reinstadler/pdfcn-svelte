export type Renderer = 'forme' | 'takumi';

export type CatalogItem = {
	slug: string;
	name: string;
	description: string;
	category: 'Content' | 'Layout' | 'Data' | 'Document';
	renderers: readonly Renderer[];
};

export type TemplateItem = {
	slug: string;
	name: string;
	description: string;
	kind: 'Invoice' | 'Report';
	tone: string;
};

export const components = [
	{ slug: 'alert', name: 'Alert', description: 'Call attention to important document information.', category: 'Content', renderers: ['forme', 'takumi'] },
	{ slug: 'badge', name: 'Badge', description: 'Compact status and category labels.', category: 'Content', renderers: ['forme', 'takumi'] },
	{ slug: 'card', name: 'Card', description: 'Group related content in a bordered or filled surface.', category: 'Layout', renderers: ['forme', 'takumi'] },
	{ slug: 'data-table', name: 'Data Table', description: 'Render typed column definitions from structured records.', category: 'Data', renderers: ['forme', 'takumi'] },
	{ slug: 'divider', name: 'Divider', description: 'Separate sections with a themed rule.', category: 'Layout', renderers: ['forme', 'takumi'] },
	{ slug: 'form', name: 'Form', description: 'Present field groups and read-only form values.', category: 'Data', renderers: ['forme', 'takumi'] },
	{ slug: 'graph', name: 'Graph', description: 'Build bar, line, and area data visualizations.', category: 'Data', renderers: ['forme', 'takumi'] },
	{ slug: 'heading', name: 'Heading', description: 'A themed document heading with six semantic levels.', category: 'Content', renderers: ['forme', 'takumi'] },
	{ slug: 'keep-together', name: 'Keep Together', description: 'Ask the renderer to keep related content on one page.', category: 'Document', renderers: ['forme', 'takumi'] },
	{ slug: 'key-value', name: 'Key Value', description: 'Display compact metadata and label-value pairs.', category: 'Data', renderers: ['forme', 'takumi'] },
	{ slug: 'link', name: 'Link', description: 'Create styled, clickable document links.', category: 'Content', renderers: ['forme', 'takumi'] },
	{ slug: 'list', name: 'List', description: 'Render ordered, unordered, or checklist content.', category: 'Content', renderers: ['forme', 'takumi'] },
	{ slug: 'page-break', name: 'Page Break', description: 'Start following content on a new page.', category: 'Document', renderers: ['forme', 'takumi'] },
	{ slug: 'page-footer', name: 'Page Footer', description: 'Add repeating footer content and page metadata.', category: 'Document', renderers: ['forme', 'takumi'] },
	{ slug: 'page-header', name: 'Page Header', description: 'Add a branded, repeating page header.', category: 'Document', renderers: ['forme', 'takumi'] },
	{ slug: 'page-number', name: 'Page Number', description: 'Place current and total page indicators.', category: 'Document', renderers: ['forme', 'takumi'] },
	{ slug: 'pdf-image', name: 'PDF Image', description: 'Place local, remote, or data URI imagery.', category: 'Content', renderers: ['forme', 'takumi'] },
	{ slug: 'qrcode', name: 'QR Code', description: 'Encode URLs or short values as a document-safe QR code.', category: 'Content', renderers: ['forme', 'takumi'] },
	{ slug: 'section', name: 'Section', description: 'Create consistent document regions and spacing.', category: 'Layout', renderers: ['forme', 'takumi'] },
	{ slug: 'signature', name: 'Signature', description: 'Lay out one or more signer lines and details.', category: 'Content', renderers: ['forme', 'takumi'] },
	{ slug: 'stack', name: 'Stack', description: 'Arrange children vertically or horizontally with a gap.', category: 'Layout', renderers: ['forme', 'takumi'] },
	{ slug: 'table', name: 'Table', description: 'Compose headers, rows, cells, bodies, and footers.', category: 'Data', renderers: ['forme', 'takumi'] },
	{ slug: 'text', name: 'Text', description: 'The foundational themed typography primitive.', category: 'Content', renderers: ['forme', 'takumi'] },
	{ slug: 'watermark', name: 'Watermark', description: 'Place a subtle repeated or centered mark behind a page.', category: 'Document', renderers: ['forme', 'takumi'] }
] as const satisfies readonly CatalogItem[];

export const templates = [
	{ slug: 'invoice-classic', name: 'Classic Invoice', description: 'A familiar, balanced invoice for everyday billing.', kind: 'Invoice', tone: 'Timeless' },
	{ slug: 'invoice-consultant', name: 'Consultant Invoice', description: 'A service-led layout for time, projects, and retainers.', kind: 'Invoice', tone: 'Editorial' },
	{ slug: 'invoice-corporate', name: 'Corporate Invoice', description: 'A structured invoice for established organizations.', kind: 'Invoice', tone: 'Formal' },
	{ slug: 'invoice-creative', name: 'Creative Invoice', description: 'A high-character layout for studios and independents.', kind: 'Invoice', tone: 'Expressive' },
	{ slug: 'invoice-minimal', name: 'Minimal Invoice', description: 'A calm, restrained invoice with generous whitespace.', kind: 'Invoice', tone: 'Quiet' },
	{ slug: 'invoice-modern', name: 'Modern Invoice', description: 'A crisp billing document with clear visual hierarchy.', kind: 'Invoice', tone: 'Contemporary' },
	{ slug: 'report-financial', name: 'Financial Report', description: 'Executive metrics, performance data, and tables.', kind: 'Report', tone: 'Analytical' },
	{ slug: 'report-marketing', name: 'Marketing Report', description: 'Campaign outcomes, channel metrics, and narrative.', kind: 'Report', tone: 'Energetic' },
	{ slug: 'report-operations', name: 'Operations Report', description: 'Operational health, throughput, and next actions.', kind: 'Report', tone: 'Practical' },
	{ slug: 'report-security', name: 'Security Report', description: 'Risk posture, findings, and remediation priorities.', kind: 'Report', tone: 'Technical' }
] as const satisfies readonly TemplateItem[];

export const componentCategories = ['Content', 'Layout', 'Data', 'Document'] as const;
