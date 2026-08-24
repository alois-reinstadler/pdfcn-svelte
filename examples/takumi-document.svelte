<script lang="ts">
	import { PdfcnThemeProvider } from 'pdfcn-svelte';
	import { blueprintTheme } from 'pdfcn-svelte/themes';
	import {
		Badge,
		Card,
		Document,
		Heading,
		Page,
		Stack,
		Text
	} from 'pdfcn-svelte/bases/takumi';

	let { project = 'Apollo' }: { project?: string } = $props();
</script>

<PdfcnThemeProvider theme={blueprintTheme}>
	<Document title="Project brief">
		<Page size="A4" style={{ padding: 48 }}>
			<Stack gap="lg">
				<Stack direction="horizontal" align="center" justify="between">
					<Heading level={1} noMargin>{project}</Heading>
					<Badge variant="info" label="In review" />
				</Stack>

				<Card title="Scope" variant="bordered">
					<Text noMargin>
						This base renders an HTML/CSS-compatible document tree for preview or a
						separate compatible integration.
					</Text>
				</Card>
			</Stack>
		</Page>
	</Document>
</PdfcnThemeProvider>
