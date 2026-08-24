<script lang="ts">
	import View from '$lib/bases/takumi/lib/View.svelte';
	import PDFText from '$lib/bases/takumi/lib/Text.svelte';
	import { flattenTakumiStyle } from '$lib/bases/takumi/lib/pdf-primitives';
	import { usePdfcnTheme } from '$lib/theme-provider.svelte';
	import { resolveColor } from '$lib/utils/resolve-color';
	import type { PDFComponentProps, Style } from '$lib/types/pdf-components';
	import type { PdfcnTheme } from '$lib/types/pdf-themes';

	export type KeyValueDirection = 'horizontal' | 'vertical';
	export type KeyValueSize = 'sm' | 'md' | 'lg';

	/**
	 * A single key-value row with optional per-item color and style overrides.
	 * Props - `key` | `value` | `valueColor` | `valueStyle` | `keyStyle`
	 * @see {@link KeyValueEntry}
	 */
	export interface KeyValueEntry {
		key: string;
		value: string;
		valueColor?: string;
		valueStyle?: Style;
		keyStyle?: Style;
	}

	/**
	 * List of key-value pairs with layout and style options.
	 * Props - `items` | `direction` | `divided` | `size` | `labelFlex` | `labelColor` | `valueColor` | `boldValue` | `noWrap` | `dividerColor` | `dividerThickness` | `dividerMargin` | `style`
	 * @see {@link KeyValueProps}
	 */
	export interface KeyValueProps extends Omit<PDFComponentProps, 'children'> {
		items: KeyValueEntry[];
		/** @default 'horizontal' */
		direction?: KeyValueDirection;
		/** @default false */
		divided?: boolean;
		/** @default 'md' */
		size?: KeyValueSize;
		/** @default 1 */
		labelFlex?: number;
		labelColor?: string;
		valueColor?: string;
		/** @default false */
		boldValue?: boolean;
		/** @default false */
		noWrap?: boolean;
		dividerColor?: string;
		dividerThickness?: number;
		dividerMargin?: number;
	}

	let {
		items,
		direction = 'horizontal',
		divided = false,
		size = 'md',
		labelFlex = 1,
		labelColor,
		valueColor,
		boldValue = false,
		noWrap = false,
		dividerColor,
		dividerThickness,
		dividerMargin,
		style
	}: KeyValueProps = $props();

	const theme = usePdfcnTheme();

	const createKeyValueStyles = (t: PdfcnTheme) => {
		const { spacing, fontWeights } = t.primitives;
		const c = t.colors;
		const { body } = t.typography;
		const keyBase = {
			color: c.mutedForeground,
			fontFamily: body.fontFamily,
			fontWeight: fontWeights.medium
		};
		const valueBase = {
			color: c.foreground,
			fontFamily: body.fontFamily,
			fontWeight: fontWeights.regular
		};
		return {
			container: { flexDirection: 'column' },
			divider: {
				borderBottomColor: c.border,
				borderBottomStyle: 'solid',
				borderBottomWidth: spacing[0.5]
			},
			keyLg: { ...keyBase, fontSize: t.primitives.typography.base },
			keyMd: { ...keyBase, fontSize: body.fontSize },
			keySm: { ...keyBase, fontSize: t.primitives.typography.xs },
			rowHorizontal: {
				alignItems: 'flex-start',
				flexDirection: 'row',
				paddingVertical: spacing[1]
			},
			rowVertical: {
				flexDirection: 'column',
				marginBottom: t.spacing.paragraphGap
			},
			valueBold: { fontWeight: fontWeights.bold },
			valueLg: { ...valueBase, fontSize: t.primitives.typography.base },
			valueMd: { ...valueBase, fontSize: body.fontSize },
			valueSm: { ...valueBase, fontSize: t.primitives.typography.xs }
		};
	};

	const styles = $derived(createKeyValueStyles(theme));

	const sizeMaps = $derived.by(() => ({
		key: {
			sm: styles.keySm,
			md: styles.keyMd,
			lg: styles.keyLg
		} as Record<KeyValueSize, Style>,
		value: {
			sm: styles.valueSm,
			md: styles.valueMd,
			lg: styles.valueLg
		} as Record<KeyValueSize, Style>
	}));

	const containerStyle = $derived(
		flattenTakumiStyle([styles.container, style ?? undefined])
	);

	const getKeyStyles = (item: KeyValueEntry): Style => {
		const styleArray: Record<string, unknown>[] = [sizeMaps.key[size]];
		if (labelColor) {
			styleArray.push({ color: resolveColor(labelColor, theme.colors) });
		}
		if (item.keyStyle) {
			styleArray.push(item.keyStyle);
		}
		return flattenTakumiStyle(styleArray) ?? {};
	};

	const getValStyles = (item: KeyValueEntry): Style => {
		const styleArray: Record<string, unknown>[] = [sizeMaps.value[size]];
		if (boldValue) {
			styleArray.push(styles.valueBold);
		}
		const resolvedValueColor = item.valueColor ?? valueColor;
		if (resolvedValueColor) {
			styleArray.push({ color: resolveColor(resolvedValueColor, theme.colors) });
		}
		if (item.valueStyle) {
			styleArray.push(item.valueStyle);
		}
		return flattenTakumiStyle(styleArray) ?? {};
	};

	const getHorizontalRowStyles = (index: number): Style => {
		const isLast = index === items.length - 1;
		const styleArray: Record<string, unknown>[] = [styles.rowHorizontal];
		if (divided && !isLast) {
			let dividerStyle: Style = {};
			if (dividerColor) {
				dividerStyle = {
					...dividerStyle,
					borderBottomColor: resolveColor(dividerColor, theme.colors)
				};
			}
			if (dividerThickness) {
				dividerStyle = { ...dividerStyle, borderBottomWidth: dividerThickness };
			}
			if (dividerMargin) {
				dividerStyle = { ...dividerStyle, marginBottom: dividerMargin };
			}
			styleArray.push({ ...styles.divider, ...dividerStyle });
		}
		return flattenTakumiStyle(styleArray) ?? {};
	};

	const getVerticalRowStyles = (index: number): Style => {
		const isLast = index === items.length - 1;
		return (
			flattenTakumiStyle([
				styles.rowVertical,
				divided && !isLast ? styles.divider : undefined
			]) ?? {}
		);
	};
</script>

<View wrap={!noWrap} style={containerStyle}>
	{#each items as item, index (item.key)}
		{#if direction === 'horizontal'}
			<View style={getHorizontalRowStyles(index)}>
				<PDFText style={flattenTakumiStyle([getKeyStyles(item), { flex: labelFlex }])}>
					{item.key}
				</PDFText>
				<PDFText
					style={flattenTakumiStyle([getValStyles(item), { flex: 1, textAlign: 'right' }])}
				>
					{item.value}
				</PDFText>
			</View>
		{:else}
			<View style={getVerticalRowStyles(index)}>
				<PDFText style={getKeyStyles(item)}>{item.key}</PDFText>
				<PDFText style={getValStyles(item)}>{item.value}</PDFText>
			</View>
		{/if}
	{/each}
</View>
