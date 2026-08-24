<script lang="ts">
	import Document from '$lib/bases/takumi/lib/Document.svelte';
	import Image from '$lib/bases/takumi/lib/Image.svelte';
	import Link from '$lib/bases/takumi/lib/Link.svelte';
	import Page from '$lib/bases/takumi/lib/Page.svelte';
	import Text from '$lib/bases/takumi/lib/Text.svelte';
	import View from '$lib/bases/takumi/lib/View.svelte';
</script>

<Document title="Takumi primitive contract">
	<Page>
		<View className="view-alias" id="view-id" data-contract="view" aria-label="View primitive" />
		<Text
			className="text-alias"
			href="https://example.com/text"
			id="text-id"
			rel="noreferrer"
			target="_blank"
		>
			Text link
		</Text>
		<Image
			className="image-alias"
			src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
			alt="One pixel"
			loading="lazy"
			data-contract="image"
		/>
		<Link
			className="link-alias"
			src="https://example.com/link"
			target="_blank"
			data-contract="link"
		>
			Primitive link
		</Link>
		<Text class="svelte-class">Svelte class alias</Text>
	</Page>
</Document>
