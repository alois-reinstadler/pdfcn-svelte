<script lang="ts">
	import View from '$lib/bases/takumi/lib/View.svelte';
	import { usePdfcnTheme } from '$lib/theme-provider.svelte';
	import type { PDFComponentProps } from '$lib/types/pdf-components';

	export type StackGap = 'none' | 'sm' | 'md' | 'lg' | 'xl';
	export type StackDirection = 'vertical' | 'horizontal';
	export type StackAlign = 'start' | 'center' | 'end' | 'stretch';
	export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around';

	/**
	 * Flex layout container with gap and direction control.
	 * Props - `gap` | `direction` | `align` | `justify` | `wrap` | `noWrap` | `children` | `style`
	 */
	export interface StackProps extends PDFComponentProps {
		/** @default 'md' */
		gap?: StackGap;
		/** @default 'vertical' */
		direction?: StackDirection;
		/** @default 'start' */
		align?: StackAlign;
		/** @default 'start' */
		justify?: StackJustify;
		/** @default false */
		wrap?: boolean;
		/** @default false */
		noWrap?: boolean;
	}

	let {
		gap = 'md',
		direction = 'vertical',
		align,
		justify,
		wrap = false,
		noWrap = false,
		children,
		style
	}: StackProps = $props();

	const theme = usePdfcnTheme();

	const createStackStyles = (t: typeof theme) => {
		const { spacing } = t.primitives;
		return {
			horizontal: { flexDirection: 'row' },
			vertical: { flexDirection: 'column' },
			gapNone: { gap: spacing[0] },
			gapSm: { gap: spacing[2] },
			gapMd: { gap: spacing[4] },
			gapLg: { gap: spacing[6] },
			gapXl: { gap: spacing[8] },
			alignStart: { alignItems: 'flex-start' },
			alignCenter: { alignItems: 'center' },
			alignEnd: { alignItems: 'flex-end' },
			alignStretch: { alignItems: 'stretch' },
			justifyStart: { justifyContent: 'flex-start' },
			justifyCenter: { justifyContent: 'center' },
			justifyEnd: { justifyContent: 'flex-end' },
			justifyBetween: { justifyContent: 'space-between' },
			justifyAround: { justifyContent: 'space-around' },
			wrap: { flexWrap: 'wrap' }
		};
	};

	const styles = $derived(createStackStyles(theme));

	const mergedStyle = $derived.by(() => {
		const gapStyles: Record<string, Record<string, unknown>> = {
			none: styles.gapNone,
			sm: styles.gapSm,
			md: styles.gapMd,
			lg: styles.gapLg,
			xl: styles.gapXl
		};
		const alignStyles: Record<string, Record<string, unknown>> = {
			start: styles.alignStart,
			center: styles.alignCenter,
			end: styles.alignEnd,
			stretch: styles.alignStretch
		};
		const justifyStyles: Record<string, Record<string, unknown>> = {
			start: styles.justifyStart,
			center: styles.justifyCenter,
			end: styles.justifyEnd,
			between: styles.justifyBetween,
			around: styles.justifyAround
		};
		const styleArray: Record<string, unknown>[] = [
			direction === 'horizontal' ? styles.horizontal : styles.vertical,
			gapStyles[gap]
		];
		if (align && align in alignStyles) {
			styleArray.push(alignStyles[align]);
		}
		if (justify && justify in justifyStyles) {
			styleArray.push(justifyStyles[justify]);
		}
		if (wrap) {
			styleArray.push(styles.wrap);
		}
		if (style) {
			styleArray.push(...[style].flat().filter(Boolean));
		}
		return styleArray;
	});
</script>

<View wrap={noWrap ? false : undefined} style={mergedStyle}>
	{@render children?.()}
</View>
