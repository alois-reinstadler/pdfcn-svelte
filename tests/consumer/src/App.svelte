<script lang="ts">
	import {
		PdfcnThemeProvider,
		cn,
		modernTheme,
		type PdfcnTheme
	} from 'pdfcn-svelte';
	import {
		THEME_NAMES,
		getTheme,
		type RegistryThemeName
	} from 'pdfcn-svelte/themes';
	import {
		InvoiceClassicDocument as FormeInvoice,
		MaybeFixed,
		Stack as FormeStack,
		Text as FormeText,
		mergeFormeStyles,
		type Style as FormeStyle
	} from 'pdfcn-svelte/bases/forme';
	import {
		InvoiceClassicDocument as TakumiInvoice,
		Stack as TakumiStack,
		Text as TakumiText,
		pointToCssPixel,
		type Style as TakumiStyle,
		type TakumiPdfRenderOptions
	} from 'pdfcn-svelte/bases/takumi';

	const selectedName: RegistryThemeName = 'modern';
	const selectedTheme: PdfcnTheme = getTheme(selectedName)!.theme;
	const formeStyle: FormeStyle | undefined = mergeFormeStyles(
		{ padding: 4 },
		false,
		{ color: selectedTheme.colors.foreground }
	);
	const takumiStyle: TakumiStyle = { padding: pointToCssPixel(6) };
	const takumiOptions: TakumiPdfRenderOptions = { margin: 0, size: 'a4' };
	const representativeSurface = [
		FormeInvoice,
		MaybeFixed,
		FormeStack,
		FormeText,
		TakumiInvoice,
		takumiOptions
	];
</script>

<PdfcnThemeProvider theme={modernTheme}>
	<main class={cn('consumer', selectedName)} data-themes={THEME_NAMES.length}>
		<TakumiStack gap="sm" style={takumiStyle}>
			<TakumiText variant="lg" weight="semibold" noMargin>Fresh consumer</TakumiText>
			<TakumiText noMargin>
				Loaded {representativeSurface.length} representative exports with {formeStyle?.padding ?? 0}pt.
			</TakumiText>
		</TakumiStack>
	</main>
</PdfcnThemeProvider>
