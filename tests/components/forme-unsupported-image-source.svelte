<script lang="ts">
	import PdfImage from '$lib/bases/forme/components/pdf-image/pdf-image.svelte';
</script>

<PdfImage
	src={{
		uri: 'https://example.com/private.png',
		method: 'GET',
		headers: { Authorization: 'Bearer secret' }
	} as never}
/>
