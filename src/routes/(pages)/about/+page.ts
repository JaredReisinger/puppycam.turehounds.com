import type { PageLoad } from './$types';

export const load: PageLoad = (/*{ params }*/) => {
  return {
    title: 'About',
    description:
      'More than you want to know about the PuppyCam site and how it all works.',
  };
};
