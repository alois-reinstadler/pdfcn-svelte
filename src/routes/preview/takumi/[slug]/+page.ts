import { error } from '@sveltejs/kit';
import { isTakumiPreviewSlug } from '../../../../docs/template-preview-allowlist';
import { templateSlugs } from '../../../../docs/template-showcase';
import type { PageLoad } from './$types';

export const prerender = true;

export const entries = () => templateSlugs.map((slug) => ({ slug }));

export const load: PageLoad = ({ params }) => {
	if (!isTakumiPreviewSlug(params.slug)) error(404, 'Template preview not found');
	return { slug: params.slug };
};
