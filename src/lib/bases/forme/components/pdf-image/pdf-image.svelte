<script lang="ts">
	import Image from '$lib/bases/forme/lib/Image.svelte';
	import PDFText from '$lib/bases/forme/lib/Text.svelte';
	import View from '$lib/bases/forme/lib/View.svelte';
	import { mergeFormeStyles } from '$lib/bases/forme/lib/pdf-primitives';
	import { usePdfcnTheme } from '$lib/theme-provider.svelte';
	import type { Style } from '$lib/types/pdf-components';
	import type { PdfcnTheme } from '$lib/types/pdf-themes';

	export type PdfImageHTTPMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	/** A validated PNG/JPEG data URI. Use loadImage(url) or imageDataUri(bytes) before rendering. */
	export type PdfImageSrc = string;
	/** Forme stretches two explicit dimensions; one dimension preserves the intrinsic ratio. */
	export type PdfImageFit = 'fill';
	export type PdfImageVariant = 'default' | 'full-width' | 'thumbnail' | 'avatar' | 'cover' | 'bordered' | 'rounded';

	/** Image element with layout presets, caption, and aspect ratio support. */
	export interface PdfImageProps {
		src: PdfImageSrc;
		/** @default 'default' */
		variant?: PdfImageVariant;
		width?: number | string;
		height?: number | string;
		fit?: PdfImageFit;
		/** Preprocess cropping/positioning before passing the image to Forme. */
		position?: never;
		caption?: string;
		aspectRatio?: number;
		borderRadius?: number;
		/** @default true */
		noWrap?: boolean;
		style?: Style;
	}

	let { src, variant = 'default', width, height, fit, position, caption,
		aspectRatio, borderRadius, noWrap = true, style }: PdfImageProps = $props();
	const theme = usePdfcnTheme();
	const validatedSrc = $derived.by(() => {
		if (typeof src !== 'string') {
			throw new TypeError(
				'[PdfImage] The Forme Svelte renderer accepts only string URLs, file paths, or data URIs. Resolve image requests with await loadImage({ uri, method, headers, body }) before rendering.'
			);
		}
		if (fit !== undefined && fit !== 'fill') throw new Error('[PdfImage] Forme supports fit="fill" only. Use one dimension to preserve the image ratio, preprocess the image for cropping, or use Takumi.');
		if (position !== undefined) throw new Error('[PdfImage] Forme does not support image positioning. Preprocess the image or use Takumi.');
		return src;
	});

	interface VariantDefaults { width?: number | string; height?: number | string; fit: PdfImageFit; borderRadius?: number }
	const VARIANT_DEFAULTS: Record<PdfImageVariant, VariantDefaults> = {
		avatar: { borderRadius: 999, fit: 'fill', height: 48, width: 48 },
		bordered: { fit: 'fill', width: '100%' }, cover: { fit: 'fill', height: 160, width: '100%' },
		default: { fit: 'fill' }, 'full-width': { fit: 'fill', width: '100%' },
		rounded: { borderRadius: 8, fit: 'fill', width: 200 }, thumbnail: { fit: 'fill', height: 80, width: 80 }
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
	const resolvedHeight = $derived.by(() => {
		if (height !== undefined) return height;
		if (aspectRatio !== undefined && typeof resolvedWidth === 'number') return resolvedWidth / aspectRatio;
		if (defaults.height !== undefined) return defaults.height;
		return undefined;
	});
	const imageStyle = $derived(mergeFormeStyles(
		resolvedWidth !== undefined ? { width: resolvedWidth } : undefined,
		resolvedHeight !== undefined ? { height: resolvedHeight } : undefined,
		
		(borderRadius ?? defaults.borderRadius) !== undefined ? { borderRadius: borderRadius ?? defaults.borderRadius } : undefined,
		variant === 'bordered' ? styles.imageBordered : undefined,
		style
	));
</script>

{#snippet imageContent()}
	<View style={styles.container}>
		<Image src={validatedSrc} style={imageStyle} />
		{#if caption}<PDFText style={styles.caption}>{caption}</PDFText>{/if}
	</View>
{/snippet}

{#if noWrap}<View wrap={false}>{@render imageContent()}</View>{:else}{@render imageContent()}{/if}
