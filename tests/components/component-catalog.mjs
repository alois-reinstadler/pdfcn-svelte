/**
 * The canonical component-family contract. Keep this list explicit so a newly
 * added (or accidentally removed) component directory cannot silently escape
 * the kitchen-sink render tests.
 */
export const COMPONENT_FAMILIES = Object.freeze([
	'alert',
	'badge',
	'card',
	'data-table',
	'divider',
	'form',
	'graph',
	'heading',
	'keep-together',
	'key-value',
	'link',
	'list',
	'page-break',
	'page-footer',
	'page-header',
	'page-number',
	'pdf-image',
	'qrcode',
	'section',
	'signature',
	'stack',
	'table',
	'text',
	'watermark'
]);

export const COMPONENT_MARKERS = Object.freeze(
	Object.fromEntries(COMPONENT_FAMILIES.map((name) => [name, `CMP:${name}`]))
);
