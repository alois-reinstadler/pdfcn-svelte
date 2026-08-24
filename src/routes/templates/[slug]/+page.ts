import { error } from '@sveltejs/kit';
import { getDocumentTemplate, templateSlugs } from '../../../docs/template-showcase';
import type { PageLoad } from './$types';

export const prerender = true;

export const entries = () => templateSlugs.map((slug) => ({ slug }));

export const load: PageLoad = ({ params }) => {
	const template = getDocumentTemplate(params.slug);
	if (!template) error(404, 'Document template not found');
	return { template };
};
