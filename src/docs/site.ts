export const repositoryUrl = 'https://github.com/alois-reinstadler/pdfcn-svelte';
export const siteUrl = 'https://alois-reinstadler.github.io/pdfcn-svelte';
export const registryBaseUrl = `${siteUrl}/r`;

export function registryItemUrl(renderer: 'forme' | 'takumi', item: string): string {
	return `${registryBaseUrl}/${renderer}/${item}.json`;
}

export function registryInstallCommand(renderer: 'forme' | 'takumi', item: string): string {
	return `pnpm dlx shadcn-svelte@latest add ${registryItemUrl(renderer, item)}`;
}
