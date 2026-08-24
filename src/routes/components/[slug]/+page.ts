import { error } from '@sveltejs/kit';
import { components } from '../../../docs/catalog';
import type { PageLoad } from './$types';

export const prerender = true;

export const entries = () => components.map(({ slug }) => ({ slug }));

export const load: PageLoad = ({ params }) => {
	const component = components.find(({ slug }) => slug === params.slug);
	if (!component) error(404, 'Component not found');

	return { component };
};
