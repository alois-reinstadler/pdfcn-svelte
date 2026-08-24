<script lang="ts">
	import { PdfcnThemeProvider } from 'pdfcn-svelte';
	import { modernTheme } from 'pdfcn-svelte/themes';
	import {
		Badge,
		Divider,
		Document,
		Heading,
		Page,
		Stack,
		Text
	} from 'pdfcn-svelte/bases/forme';

	let { customer = 'Ada Lovelace' }: { customer?: string } = $props();
</script>

<PdfcnThemeProvider theme={modernTheme}>
	<Document title="Account summary" author="Acme, Inc." lang="en-US">
		<Page size="A4" margin={48}>
			<Stack gap="lg">
				<Stack direction="horizontal" align="center" justify="between">
					<Heading level={1} noMargin>Account summary</Heading>
					<Badge variant="success" label="Paid" />
				</Stack>

				<Divider />
				<Text variant="lg">Prepared for {customer}</Text>
				<Text color="mutedForeground">
					This template can be passed to renderDocument from @formepdf/svelte.
				</Text>
			</Stack>
		</Page>
	</Document>
</PdfcnThemeProvider>
