/** Convert checked repository examples to the exact public imports displayed in docs.
 * @param {string} source
 */
export function packageSource(source) {
	return source
		.replaceAll("'$lib/index'", "'pdfcn-svelte'")
		.replaceAll("'$lib/themes'", "'pdfcn-svelte/themes'")
		.replaceAll("'$lib/bases/", "'pdfcn-svelte/bases/");
}
