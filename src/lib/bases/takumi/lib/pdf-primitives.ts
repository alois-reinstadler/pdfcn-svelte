import type { Style } from '$lib/types/pdf-components';

export type { Style } from '$lib/types/pdf-components';

export type StyleInput = Style | false | null | undefined | readonly StyleInput[];

/** Identity style factory matching the upstream Takumi primitive API. */
export const StyleSheet = {
	create<T extends Record<string, Style>>(styles: T): T {
		return styles;
	}
};

export const TAKUMI_DOCUMENT_PAGINATION_CONTEXT = Symbol('takumi-document-pagination');
export const TAKUMI_PAGE_PAGINATION_CONTEXT = Symbol('takumi-page-pagination');

export interface TakumiDocumentPagination {
	register(page: symbol): void;
	unregister(page: symbol): void;
	pageNumber(page: symbol): number;
	readonly totalPages: number;
}

export interface TakumiPagePagination {
	readonly pageNumber: number;
	readonly totalPages: number;
}

/**
 * pdfcn-svelte's shared component tokens follow the PDF convention of using
 * points. Takumi follows browser CSS instead, where numeric lengths are
 * pixels at 96 DPI. Converting at the primitive boundary keeps the public
 * component API and the generated document's physical measurements aligned
 * with Forme.
 */
export const PDF_POINT_TO_CSS_PIXEL = 96 / 72;

export const pointToCssPixel = (value: number): number =>
	value * PDF_POINT_TO_CSS_PIXEL;

const POINT_LENGTH_PROPERTIES = new Set([
	'blockSize',
	'borderBlockEndWidth',
	'borderBlockStartWidth',
	'borderBlockWidth',
	'borderBottomLeftRadius',
	'borderBottomRightRadius',
	'borderBottomWidth',
	'borderBlockWidth',
	'borderEndEndRadius',
	'borderEndStartRadius',
	'borderInlineEndWidth',
	'borderInlineStartWidth',
	'borderInlineWidth',
	'borderLeftWidth',
	'borderRadius',
	'borderRightWidth',
	'borderStartEndRadius',
	'borderStartStartRadius',
	'borderTopLeftRadius',
	'borderTopRightRadius',
	'borderTopWidth',
	'borderWidth',
	'bottom',
	'columnGap',
	'flexBasis',
	'fontSize',
	'gap',
	'height',
	'inlineSize',
	'inset',
	'insetBlock',
	'insetBlockEnd',
	'insetBlockStart',
	'insetInline',
	'insetInlineEnd',
	'insetInlineStart',
	'left',
	'letterSpacing',
	'margin',
	'marginBlock',
	'marginBlockEnd',
	'marginBlockStart',
	'marginBottom',
	'marginInline',
	'marginInlineEnd',
	'marginInlineStart',
	'marginLeft',
	'marginRight',
	'marginTop',
	'maxBlockSize',
	'maxHeight',
	'maxInlineSize',
	'maxWidth',
	'minBlockSize',
	'minHeight',
	'minInlineSize',
	'minWidth',
	'outlineOffset',
	'outlineWidth',
	'padding',
	'paddingBlock',
	'paddingBlockEnd',
	'paddingBlockStart',
	'paddingBottom',
	'paddingInline',
	'paddingInlineEnd',
	'paddingInlineStart',
	'paddingLeft',
	'paddingRight',
	'paddingTop',
	'right',
	'rowGap',
	'textDecorationThickness',
	'textIndent',
	'top',
	'width'
]);

/** React-pdf-style shorthands → CSS, plus pt → px conversion for lengths. */
export const normalizeTakumiStyle = (style: Style): Style => {
	const {
		marginHorizontal,
		marginVertical,
		paddingHorizontal,
		paddingVertical,
		...normalized
	} = style;

	if (marginHorizontal !== undefined) {
		normalized.marginLeft ??= marginHorizontal;
		normalized.marginRight ??= marginHorizontal;
	}
	if (marginVertical !== undefined) {
		normalized.marginBottom ??= marginVertical;
		normalized.marginTop ??= marginVertical;
	}
	if (paddingHorizontal !== undefined) {
		normalized.paddingLeft ??= paddingHorizontal;
		normalized.paddingRight ??= paddingHorizontal;
	}
	if (paddingVertical !== undefined) {
		normalized.paddingBottom ??= paddingVertical;
		normalized.paddingTop ??= paddingVertical;
	}

	const borderSides = ['Top', 'Right', 'Bottom', 'Left'] as const;
	if (normalized.borderWidth !== undefined) {
		normalized.borderStyle ??= 'solid';
	}
	for (const side of borderSides) {
		if (normalized[`border${side}Width`] !== undefined) {
			normalized[`border${side}Style`] ??= 'solid';
		}
	}

	return Object.fromEntries(
		Object.entries(normalized).map(([property, value]) => [
			property,
			typeof value === 'number' && POINT_LENGTH_PROPERTIES.has(property)
				? pointToCssPixel(value)
				: value
		])
	);
};

const flattenStyleInput = (
	input: StyleInput,
	target: Style
): void => {
	if (!input) return;
	if (Array.isArray(input)) {
		for (const entry of input) {
			flattenStyleInput(entry, target);
		}
		return;
	}
	Object.assign(target, input);
};

/**
 * Merges conditional/nested style inputs into one point-based style object.
 *
 * Length conversion intentionally happens in `styleToCss`, the single output
 * boundary. Components often flatten styles before passing them to a
 * primitive; normalizing here would make the primitive convert those values a
 * second time.
 */
export const flattenTakumiStyle = (style?: StyleInput): Style | undefined => {
	if (!style) return undefined;
	const merged: Style = {};
	flattenStyleInput(style, merged);
	return Object.keys(merged).length > 0 ? merged : undefined;
};

/**
 * Upstream-compatible style flattener. Unlike `flattenTakumiStyle`, this
 * returns browser-ready values with PDF point lengths converted to CSS pixels.
 * Svelte primitives use `flattenTakumiStyle` internally so conversion still
 * occurs exactly once at their CSS serialization boundary.
 */
export const flatten = (style?: StyleInput): Style | undefined => {
	const merged = flattenTakumiStyle(style);
	return merged ? normalizeTakumiStyle(merged) : undefined;
};

const kebabCase = (property: string): string =>
	property.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);

/** Normalizes a point-based style object and serializes it as inline CSS. */
export const styleToCss = (style: Style): string =>
	Object.entries(normalizeTakumiStyle(style))
		.filter(([, value]) => value !== undefined && value !== null && value !== '')
		.map(([property, value]) => {
			let serialized: string;
			if (typeof value === 'number') {
				serialized = POINT_LENGTH_PROPERTIES.has(property)
					? `${value}px`
					: String(value);
			} else {
				serialized = String(value);
			}
			return `${kebabCase(property)}:${serialized}`;
		})
		.join(';');
