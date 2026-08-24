<script lang="ts">
	import PdfcnThemeProvider from '$lib/PdfcnThemeProvider.svelte';
	import {
		Alert,
		Badge,
		Card,
		DataTable,
		Divider,
		Document,
		Form,
		Graph,
		Heading,
		KeepTogether,
		KeyValue,
		Link,
		List,
		Page,
		PageFooter,
		PageHeader,
		PageNumber,
		PdfImage,
		QRCode,
		Section,
		Signature,
		Stack,
		Table,
		TableBody,
		TableCell,
		TableHeader,
		TableRow,
		Text,
		Watermark
	} from '$lib/bases/takumi';
	import { modernTheme } from '$lib/themes/modern';

	const pixel =
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
	const pageNumberFormat = 'CMP:page-number {page}/{total}';
	const rows = [{ item: 'CMP:data-table', amount: 24 }];
	const columns = [
		{ key: 'item' as const, header: 'Item' },
		{ key: 'amount' as const, header: 'Amount', align: 'right' as const }
	];
	const chart = [
		{ label: 'One', value: 2 },
		{ label: 'Two', value: 5 },
		{ label: 'Three', value: 3 }
	];
</script>

<PdfcnThemeProvider theme={modernTheme}>
	<Document title="Component contract: Takumi">
		<Page size="A4" style={{ padding: 24 }}>
			<Watermark text="CMP:watermark" fontSize={22} opacity={0.06} />
			<PageHeader
				title="CMP:page-header"
				subtitle="Renderer contract"
				rightText="TAKUMI"
				variant="two-column"
			/>
			<Heading level={2} transform="uppercase" tracking="wide">CMP:heading</Heading>
			<Text variant="sm" weight="bold" italic decoration="underline">CMP:text</Text>
			<Stack direction="horizontal" gap="sm" justify="between" noWrap>
				<Badge label="CMP:badge" variant="primary" size="lg" />
				<Text noMargin variant="xs">CMP:stack</Text>
			</Stack>
			<Alert variant="error" title="CMP:alert" description="Representative error alert" />
			<Card title="CMP:card" text="Muted, padded card body" variant="muted" padding="sm" />
			<Section variant="highlight" spacing="sm" padding="sm" noWrap>
				<Text noMargin variant="xs">CMP:section</Text>
			</Section>
			<KeepTogether minPresenceAhead={20}>
				<Text noMargin variant="xs">CMP:keep-together</Text>
			</KeepTogether>
			<KeyValue
				items={[{ key: 'CMP:key-value', value: 'verified' }]}
				direction="vertical"
				divided
				size="sm"
				boldValue
			/>
			<Link href="https://example.com/contracts" variant="primary" underline="none">
				CMP:link
			</Link>
			<List
				variant="checklist"
				gap="xs"
				items={[{ text: 'CMP:list', checked: true, children: [{ text: 'Nested item' }] }]}
			/>
			<Divider label="CMP:divider" variant="dashed" thickness="medium" spacing="sm" />
		</Page>
		<Page size="A4" style={{ padding: 24 }}>
			<DataTable
				{columns}
				data={rows}
				footer={{ item: 'Total', amount: 24 }}
				variant="grid"
				size="compact"
				stripe
			/>
			<Table variant="primary-header" zebraStripe noWrap>
				<TableHeader>
					<TableRow header><TableCell text="CMP:table" header /><TableCell text="Status" header /></TableRow>
				</TableHeader>
				<TableBody>
					<TableRow><TableCell text="Manual row" /><TableCell text="Ready" align="right" /></TableRow>
				</TableBody>
			</Table>
			<Form
				title="CMP:form"
				subtitle="Two-column outlined form"
				variant="outlined"
				labelPosition="left"
				groups={[
					{
						title: 'Contact',
						layout: 'two-column',
						fields: [
							{ label: 'Name', hint: 'Ada Lovelace' },
							{ label: 'Role', hint: 'Analyst' }
						]
					}
				]}
			/>
			<Graph
				variant="line"
				data={chart}
				title="CMP:graph"
				subtitle="Three-point series"
				width={260}
				height={110}
				legend="none"
				showValues
				smooth
			/>
		</Page>
		<Page size="A4" style={{ padding: 24 }}>
			<PdfImage src={pixel} variant="rounded" width={16} height={16} caption="CMP:pdf-image" />
			<QRCode value="https://example.com/CMP:qrcode" size={46} errorLevel="H" caption="CMP:qrcode" />
			<Signature
				variant="double"
				signers={[
					{ label: 'CMP:signature', name: 'Ada Lovelace', title: 'Author' },
					{ label: 'Approved by', name: 'Grace Hopper', title: 'Reviewer' }
				]}
			/>
			<PageNumber format={pageNumberFormat} align="right" size="xs" muted={false} />
			<PageFooter
				variant="three-column"
				leftText="CMP:page-footer"
				centerText="Contracts"
				rightText="Complete"
				phone="+1 555 0100"
			/>
		</Page>
	</Document>
</PdfcnThemeProvider>
