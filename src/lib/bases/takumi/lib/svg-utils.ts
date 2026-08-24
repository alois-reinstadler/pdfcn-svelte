import type { Snippet } from 'svelte';

export type SvgValue = string | number | boolean | null | undefined;
export type SvgStyle = Record<string, SvgValue>;

/** Common static SVG props accepted by pdfcn's shape primitives. */
export interface SvgElementProps {
	children?: Snippet;
	style?: SvgStyle | string;
	class?: string;
	className?: string;
	[attribute: string]: unknown;
}

export interface SvgRootProps extends SvgElementProps {
	width?: string | number;
	height?: string | number;
	viewBox?: string;
}

const SVG_ATTRIBUTE_NAMES: Record<string, string> = {
	className: 'class',
	dominantBaseline: 'dominant-baseline',
	fillOpacity: 'fill-opacity',
	fillRule: 'fill-rule',
	fontFamily: 'font-family',
	fontSize: 'font-size',
	fontStyle: 'font-style',
	fontWeight: 'font-weight',
	letterSpacing: 'letter-spacing',
	markerEnd: 'marker-end',
	markerMid: 'marker-mid',
	markerStart: 'marker-start',
	strokeDasharray: 'stroke-dasharray',
	strokeDashoffset: 'stroke-dashoffset',
	strokeLinecap: 'stroke-linecap',
	strokeLinejoin: 'stroke-linejoin',
	strokeMiterlimit: 'stroke-miterlimit',
	strokeOpacity: 'stroke-opacity',
	strokeWidth: 'stroke-width',
	textAnchor: 'text-anchor'
};

const kebabCase = (property: string): string =>
	property.replace(/[A-Z]/g, (character) => `-${character.toLowerCase()}`);

export const svgStyleToCss = (style?: SvgStyle | string): string | undefined => {
	if (typeof style === 'string') return style;
	if (!style) return undefined;

	return Object.entries(style)
		.filter(([, value]) => value !== undefined && value !== null && value !== '')
		.map(([property, value]) => `${kebabCase(property)}:${String(value)}`)
		.join(';');
};

/** Normalizes React-style SVG attribute aliases for native Svelte SVG nodes. */
export const normalizeTakumiSvgAttributes = (
	props: SvgElementProps
): Record<string, SvgValue> => {
	const normalized: Record<string, SvgValue> = {};

	for (const [name, value] of Object.entries(props)) {
		if (value === undefined || name === 'children') continue;

		if (name === 'style') {
			normalized.style = svgStyleToCss(value as SvgStyle | string);
			continue;
		}

		if (typeof value !== 'function') {
			normalized[SVG_ATTRIBUTE_NAMES[name] ?? name] = value as SvgValue;
		}
	}

	return normalized;
};

export const svgAttributeName = (name: string): string =>
	SVG_ATTRIBUTE_NAMES[name] ?? name;
