<script lang="ts">
	import Image from '$lib/bases/takumi/lib/Image.svelte';
	import PDFText from '$lib/bases/takumi/lib/Text.svelte';
	import View from '$lib/bases/takumi/lib/View.svelte';
	import { flattenTakumiStyle } from '$lib/bases/takumi/lib/pdf-primitives';
	import { usePdfcnTheme } from '$lib/theme-provider.svelte';
	import type { Style } from '$lib/types/pdf-components';
	import type { PdfcnTheme } from '$lib/types/pdf-themes';

	export type PdfImageHTTPMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	export type PdfImageSrc = string | { uri: string; method?: PdfImageHTTPMethod; headers?: Record<string, string>; body?: string };
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
	interface VariantDefaults { width?: number | string; height?: number | string; fit: PdfImageFit; borderRadius?: number }
	const VARIANT_DEFAULTS: Record<PdfImageVariant, VariantDefaults> = {
		avatar: { borderRadius: 999, fit: 'cover', height: 48, width: 48 }, bordered: { fit: 'contain', width: '100%' },
		cover: { fit: 'cover', height: 160, width: '100%' }, default: { fit: 'contain' }, 'full-width': { fit: 'cover', width: '100%' },
		rounded: { borderRadius: 8, fit: 'contain', width: 200 }, thumbnail: { fit: 'cover', height: 80, width: 80 }
	};
	const UNSUPPORTED_FORMATS = new Set(['webp', 'avif', 'heic', 'heif', 'ico']);
	const detectFormat = (value: PdfImageSrc): string | null => {
		if (typeof value !== 'string') return null;
		const dataMatch = value.match(/^data:image\/([a-zA-Z0-9+.-]+)/);
		if (dataMatch) return dataMatch[1].toLowerCase();
		return value.split('?')[0].split('.').pop()?.toLowerCase() ?? null;
	};
	$effect.pre(() => {
		const format = detectFormat(src);
		if (format && UNSUPPORTED_FORMATS.has(format)) console.warn(`[PdfImage] Unsupported format "${format}" detected. react-pdf supports: JPEG, PNG, GIF (first frame), BMP, SVG. Convert to PNG or JPEG before use.`);
	});
	const createImageStyles = (t: PdfcnTheme) => ({
		caption: { color: t.colors.mutedForeground, fontFamily: t.typography.body.fontFamily, fontSize: t.primitives.typography.xs, marginTop: t.primitives.spacing[1], textAlign: 'center' },
		container: { flexDirection: 'column' }, imageBordered: { borderColor: t.colors.border, borderStyle: 'solid', borderWidth: 1 }
	});
	const styles = $derived(createImageStyles(theme));
	const defaults = $derived(VARIANT_DEFAULTS[variant]);
	const resolvedWidth = $derived(width ?? defaults.width);
	const resolvedHeight = $derived.by(() => height !== undefined ? height : defaults.height !== undefined ? defaults.height : aspectRatio !== undefined && typeof resolvedWidth === 'number' ? resolvedWidth / aspectRatio : undefined);
	const imageStyle = $derived(flattenTakumiStyle([
		resolvedWidth !== undefined ? { width: resolvedWidth } : undefined,
		resolvedHeight !== undefined ? { height: resolvedHeight } : undefined,
		{ objectFit: fit ?? defaults.fit, objectPosition: position },
		(borderRadius ?? defaults.borderRadius) !== undefined ? { borderRadius: borderRadius ?? defaults.borderRadius } : undefined,
		variant === 'bordered' ? styles.imageBordered : undefined, style
	]));
</script>

{#snippet imageContent()}
	<View style={styles.container}><Image src={src} style={imageStyle} />{#if caption}<PDFText style={styles.caption}>{caption}</PDFText>{/if}</View>
{/snippet}
{#if noWrap}<View style={{ breakInside: 'avoid' }}>{@render imageContent()}</View>{:else}{@render imageContent()}{/if}
