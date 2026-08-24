import type { Snippet } from 'svelte';

export type SvgValue = string | number | boolean | null | undefined;
export type SvgStyle = Record<string, SvgValue>;

/** Common static SVG props accepted by pdfcn's shape primitives. */
export interface SvgElementProps {
	children?: Snippet;
	style?: SvgStyle;
	class?: string;
	className?: string;
	[attribute: string]: unknown;
}

export interface SvgRootProps extends SvgElementProps {
	width?: number;
	height?: number;
	viewBox?: string;
	href?: string;
	alt?: string;
	content?: string;
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

/**
 * Normalizes React-style SVG aliases and flattens presentation styles into
 * attributes, matching pdfcn's Forme React helper.
 */
export const normalizeFormeSvgAttributes = (
	props: SvgElementProps
): Record<string, SvgValue> => {
	const normalized: Record<string, SvgValue> = {};

	for (const [name, value] of Object.entries(props)) {
		if (value === undefined || name === 'children') continue;

		if (name === 'style' && value && typeof value === 'object') {
			for (const [styleName, styleValue] of Object.entries(value)) {
				if (styleValue !== undefined) {
					normalized[SVG_ATTRIBUTE_NAMES[styleName] ?? styleName] = styleValue;
				}
			}
			continue;
		}

		if (typeof value !== 'function') {
			normalized[SVG_ATTRIBUTE_NAMES[name] ?? name] = value as SvgValue;
		}
	}

	return normalized;
};

/** Removes Svelte's hydration boundary comments from captured SVG markup. */
export const cleanCapturedSvg = (markup: string): string =>
	markup.replace(/<!--[\s\S]*?-->/g, '');
