<script lang="ts">
	import Image from '$lib/bases/takumi/lib/Image.svelte';
	import PDFText from '$lib/bases/takumi/lib/Text.svelte';
	import View from '$lib/bases/takumi/lib/View.svelte';
	import { flattenTakumiStyle } from '$lib/bases/takumi/lib/pdf-primitives';
	import { usePdfcnTheme } from '$lib/theme-provider.svelte';
	import type { Style } from '$lib/types/pdf-components';
	import type { PdfcnTheme } from '$lib/types/pdf-themes';

	export type PdfImageHTTPMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	/** Resolve authenticated requests with loadImage before rendering. */
	export type PdfImageSrc = string;
	export type PdfImageFit = 'cover' | 'contain' | 'fill' | 'none';
	export type PdfImageVariant = 'default' | 'full-width' | 'thumbnail' | 'avatar' | 'cover' | 'bordered' | 'rounded';

	/** Image element with layout presets, caption, and aspect ratio support. */
	export interface PdfImageProps {
		src: PdfImageSrc;
		/** @default 'default' */ variant?: PdfImageVariant;
		width?: number | string; height?: number | string; fit?: PdfImageFit;
		/** @default '50% 50%' */ position?: string;
		caption?: string; aspectRatio?: number; borderRadius?: number;
		/** @default true */ noWrap?: boolean;
		style?: Style;
	}
	let { src, variant = 'default', width, height, fit, position = '50% 50%', caption, aspectRatio, borderRadius, noWrap = true, style }: PdfImageProps = $props();
	const theme = usePdfcnTheme();
	const validatedSrc = $derived.by(() => {
		if (typeof src !== 'string' || !src.trim()) throw new TypeError('[PdfImage] src must be a URL or data URI string. For request options, await loadImage({ uri, method, headers, body }) before rendering.');
		return src;
	});
	interface VariantDefaults { width?: number | string; height?: number | string; fit: PdfImageFit; borderRadius?: number }
	const VARIANT_DEFAULTS: Record<PdfImageVariant, VariantDefaults> = {
		avatar: { borderRadius: 999, fit: 'cover', height: 48, width: 48 }, bordered: { fit: 'contain', width: '100%' },
		cover: { fit: 'cover', height: 160, width: '100%' }, default: { fit: 'contain' }, 'full-width': { fit: 'cover', width: '100%' },
		rounded: { borderRadius: 8, fit: 'contain', width: 200 }, thumbnail: { fit: 'cover', height: 80, width: 80 }
	};

	const createImageStyles = (t: PdfcnTheme) => ({
		caption: { color: t.colors.mutedForeground, fontFamily: t.typography.body.fontFamily, fontSize: t.primitives.typography.xs, marginTop: t.primitives.spacing[1], textAlign: 'center' },
		container: { flexDirection: 'column' }, imageBordered: { borderColor: t.colors.border, borderStyle: 'solid', borderWidth: 1 }
	});
	const styles = $derived(createImageStyles(theme));
	const defaults = $derived(VARIANT_DEFAULTS[variant]);
	const resolvedWidth = $derived.by(() => {
		if (aspectRatio !== undefined && (!Number.isFinite(aspectRatio) || aspectRatio <= 0)) throw new Error('[PdfImage] aspectRatio must be positive and finite.');
		if (aspectRatio !== undefined && typeof (width ?? defaults.width) !== 'number') throw new Error('[PdfImage] aspectRatio requires a numeric width in points.');
		if (aspectRatio !== undefined && height !== undefined) throw new Error('[PdfImage] Choose aspectRatio or height, not both.');
		for (const dimension of [width, height]) if (typeof dimension === 'number' && (!Number.isFinite(dimension) || dimension <= 0)) throw new Error('[PdfImage] width and height must be positive finite dimensions.');
		return width ?? defaults.width;
	});
	const resolvedHeight = $derived.by(() => height !== undefined ? height : aspectRatio !== undefined && typeof resolvedWidth === 'number' ? resolvedWidth / aspectRatio : defaults.height);
	const imageStyle = $derived(flattenTakumiStyle([
		resolvedWidth !== undefined ? { width: resolvedWidth } : undefined,
		resolvedHeight !== undefined ? { height: resolvedHeight } : undefined,
		{ objectFit: fit ?? defaults.fit, objectPosition: position },
		(borderRadius ?? defaults.borderRadius) !== undefined ? { borderRadius: borderRadius ?? defaults.borderRadius } : undefined,
		variant === 'bordered' ? styles.imageBordered : undefined, style
	]));
</script>

{#snippet imageContent()}
	<View style={styles.container}><Image src={validatedSrc} style={imageStyle} />{#if caption}<PDFText style={styles.caption}>{caption}</PDFText>{/if}</View>
{/snippet}
{#if noWrap}<View style={{ breakInside: 'avoid' }}>{@render imageContent()}</View>{:else}{@render imageContent()}{/if}
