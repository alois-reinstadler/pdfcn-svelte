<script lang="ts">
	import {
		normalizeTakumiSvgAttributes,
		svgAttributeName,
		svgStyleToCss,
		type SvgElementProps,
		type SvgStyle
	} from './svg-utils';

	let { children, style, ...props }: SvgElementProps = $props();
	const attributes = $derived.by(() => {
		const normalized = normalizeTakumiSvgAttributes(props);
		let remainingStyle = style;

		if (style && typeof style === 'object') {
			const { fontFamily, fontSize, fontStyle, fontWeight, ...remaining } = style as SvgStyle;
			normalized[svgAttributeName('fontFamily')] ??= fontFamily ?? 'sans-serif';
			if (fontSize !== undefined) normalized[svgAttributeName('fontSize')] ??= fontSize;
			if (fontStyle !== undefined) normalized[svgAttributeName('fontStyle')] ??= fontStyle;
			if (fontWeight !== undefined) normalized[svgAttributeName('fontWeight')] ??= fontWeight;
			remainingStyle = remaining;
		} else {
			normalized['font-family'] ??= 'sans-serif';
		}

		const css = svgStyleToCss(remainingStyle);
		if (css) normalized.style = css;
		return normalized;
	});
</script>

<text {...attributes}>{@render children?.()}</text>
