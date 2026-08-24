<script lang="ts">
	import { Document as FormeDocument } from '@formepdf/svelte';
	import type { CertificationConfig, FontRegistration } from '@formepdf/svelte';
	import type { Snippet } from 'svelte';

	import { mergeFormeStyles, type FormeStyleInput } from './pdf-primitives';

	interface Props {
		title?: string;
		author?: string;
		subject?: string;
		creator?: string;
		lang?: string;
		style?: FormeStyleInput;
		tagged?: boolean;
		pdfa?: '2a' | '2b';
		pdfUa?: boolean;
		certification?: CertificationConfig;
		/** @deprecated Use `certification`. */
		signature?: CertificationConfig;
		fonts?: FontRegistration[];
		children?: Snippet;
	}

	let {
		title,
		author,
		subject,
		creator,
		lang,
		style,
		tagged,
		pdfa,
		pdfUa,
		certification,
		signature,
		fonts,
		children
	}: Props = $props();

	const merged = $derived(mergeFormeStyles(style));
</script>

<FormeDocument
	{title}
	{author}
	{subject}
	{creator}
	{lang}
	style={merged as never}
	{tagged}
	{pdfa}
	{pdfUa}
	{certification}
	{signature}
	{fonts}
>
	{@render children?.()}
</FormeDocument>
