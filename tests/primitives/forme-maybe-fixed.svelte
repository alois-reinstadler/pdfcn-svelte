<script lang="ts">
	import Document from '$lib/bases/forme/lib/Document.svelte';
	import MaybeFixed from '$lib/bases/forme/lib/MaybeFixed.svelte';
	import Page from '$lib/bases/forme/lib/Page.svelte';
	import Text from '$lib/bases/forme/lib/Text.svelte';
</script>

<Document title="Forme MaybeFixed contract">
	<Page size="A4">
		<MaybeFixed fixed position="header" style={[false, {}, { paddingTop: 4 }]}>
			<Text>Fixed header</Text>
		</MaybeFixed>
		<MaybeFixed position="footer">
			<Text>Inline footer</Text>
		</MaybeFixed>
	</Page>
</Document>
