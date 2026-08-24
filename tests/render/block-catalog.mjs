/**
 * Canonical document-block inventory used by the renderer contract and preview generator.
 *
 * Keep this list explicit: adding a block to either renderer should require adding it here,
 * which makes the render contract a useful parity gate instead of a directory glob that can
 * silently accept an incomplete port.
 */
export const blockCatalog = [
	{
		slug: 'invoice-classic',
		identifier: 'INV-2026-001',
		expectedPages: 1
	},
	{
		slug: 'invoice-consultant',
		identifier: 'INV-2026-006',
		expectedPages: 1
	},
	{
		slug: 'invoice-corporate',
		identifier: 'INV-2026-004',
		expectedPages: 1
	},
	{
		slug: 'invoice-creative',
		identifier: 'INV-2026-005',
		expectedPages: 1
	},
	{
		slug: 'invoice-minimal',
		identifier: 'INV-2026-003',
		expectedPages: 1
	},
	{
		slug: 'invoice-modern',
		identifier: 'INV-2026-002',
		expectedPages: 1
	},
	{
		slug: 'report-financial',
		identifier: 'Quarterly Financial Report',
		expectedPages: 3
	},
	{
		slug: 'report-marketing',
		identifier: 'Growth & Marketing Report',
		expectedPages: 3
	},
	{
		slug: 'report-operations',
		identifier: 'Monthly Operations Report',
		expectedPages: 3
	},
	{
		slug: 'report-security',
		identifier: 'Security Posture Report',
		expectedPages: 3
	}
];

export function blockComponentPath(renderer, slug) {
	return `/src/lib/bases/${renderer}/blocks/${slug}/${slug}.svelte`;
}
