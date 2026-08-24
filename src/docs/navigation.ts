export type NavItem = { label: string; href: string };
export type NavGroup = { label: string; items: readonly NavItem[] };

export const docsNavigation: readonly NavGroup[] = [
	{
		label: 'Start here',
		items: [
			{ label: 'Overview', href: '/docs' },
			{ label: 'Getting started', href: '/docs/getting-started' },
			{ label: 'Installation', href: '/docs/install' }
		]
	},
	{
		label: 'Foundations',
		items: [
			{ label: 'Renderers', href: '/docs/renderers' },
			{ label: 'Themes', href: '/docs/themes' },
			{ label: 'Fonts', href: '/docs/fonts' },
			{ label: 'Parity', href: '/docs/parity' },
			{ label: 'Registry', href: '/docs/registry' },
			{ label: 'Primitives', href: '/docs/primitives' }
		]
	},
	{
		label: 'Explore',
		items: [
			{ label: 'Components', href: '/components' },
			{ label: 'Templates', href: '/templates' }
		]
	}
];
