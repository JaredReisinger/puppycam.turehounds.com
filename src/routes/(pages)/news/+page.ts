import type { PageLoad } from './$types';

export const load: PageLoad = (/*{ params }*/) => {
	return {
			title: 'News',
			description: 'All of the news and updates about the puppies.',
	};
};
