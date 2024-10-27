import type { PageLoad } from './$types';

export const load: PageLoad = (/*{ params }*/) => {
	return {
			title: 'Statistics',
			description: 'Further details and statistics about the puppies.',
	};
};
