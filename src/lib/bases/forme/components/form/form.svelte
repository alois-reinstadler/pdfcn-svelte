<script lang="ts">
	import PDFText from '$lib/bases/forme/lib/Text.svelte';
	import View from '$lib/bases/forme/lib/View.svelte';
	import { usePdfcnTheme } from '$lib/theme-provider.svelte';

	import { createFormStyles } from './form.styles';
	import type { PdfFormField, PdfFormGroup, PdfFormProps } from './form.types';

	let {
		title,
		subtitle,
		groups,
		variant = 'underline',
		labelPosition = 'above',
		noWrap = false,
		style
	}: PdfFormProps = $props();

	const theme = usePdfcnTheme();
	const styles = $derived(createFormStyles(theme, variant));
	const rootStyles = $derived([styles.root, style]);

	const columnCount = (group: PdfFormGroup): number => {
		if (group.layout === 'three-column') return 3;
		if (group.layout === 'two-column') return 2;
		return 1;
	};

	const columnsFor = (group: PdfFormGroup): PdfFormField[][] => {
		const count = columnCount(group);
		const chunkSize = Math.ceil(group.fields.length / count);
		const columns: PdfFormField[][] = [];

		if (chunkSize > 0) {
			for (let index = 0; index < group.fields.length; index += chunkSize) {
				columns.push(group.fields.slice(index, index + chunkSize));
			}
		}
		while (columns.length < count) columns.push([]);
		return columns;
	};
</script>

{#snippet field(field: PdfFormField)}
	{@const areaHeight = field.height ?? 18}
	{#if labelPosition === 'left'}
		<View style={styles.fieldLeft}>
			<PDFText style={styles.labelLeft}>{field.label}</PDFText>
			<View style={[styles.fieldArea, styles.fieldLeftArea, { minHeight: areaHeight }]}>
				{#if field.hint}<PDFText style={styles.hint}>{field.hint}</PDFText>{/if}
			</View>
		</View>
	{:else}
		<View style={styles.fieldAbove}>
			<PDFText style={styles.labelAbove}>{field.label}</PDFText>
			<View style={[styles.fieldArea, { minHeight: areaHeight }]}>
				{#if field.hint}<PDFText style={styles.hint}>{field.hint}</PDFText>{/if}
			</View>
		</View>
	{/if}
{/snippet}

{#snippet content()}
	<View style={rootStyles}>
		{#if title}<PDFText style={styles.formTitle}>{title}</PDFText>{/if}
		{#if subtitle}<PDFText style={styles.formSubtitle}>{subtitle}</PDFText>{/if}
		{#if title || subtitle}<View style={styles.formDivider} />{/if}

		{#each groups as group, groupIndex (groupIndex)}
			<View style={styles.group}>
				{#if group.title}<PDFText style={styles.groupTitle}>{group.title}</PDFText>{/if}
				{#if columnCount(group) === 1}
					{#each group.fields as item, fieldIndex (`${item.label}-${fieldIndex}`)}
						{@render field(item)}
					{/each}
				{:else}
					<View style={styles.columnsRow}>
						{#each columnsFor(group) as column, columnIndex (`${column[0]?.label ?? columnIndex}`)}
							<View style={styles.column}>
								{#each column as item, fieldIndex (`${item.label}-${fieldIndex}`)}
									{@render field(item)}
								{/each}
							</View>
						{/each}
					</View>
				{/if}
			</View>
		{/each}
	</View>
{/snippet}

{#if noWrap}
	<View wrap={false}>{@render content()}</View>
{:else}
	{@render content()}
{/if}
