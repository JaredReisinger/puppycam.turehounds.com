import { DateTime, Duration } from 'luxon';
import markdownit from 'markdown-it';
// import { alert } from '@mdit/plugin-alert';
// import { attrs } from '@mdit/plugin-attrs';
// import { container } from '@mdit/plugin-container';
// import { stylize } from '@mdit/plugin-stylize';
import { colorPlugin as color } from 'markdown-it-color';

import { createAutoFetchState } from '$lib/autofetch-data.svelte.js';
import { luxonifyShort, type ShortDateTime } from '$lib/datetime.js';

// @ts-expect-error - ts2307 - no type on YAML
import initialRawNews from '$lib/news.yaml';

const dataUrl = 'news.yaml'; // need full path?

const md = markdownit({
  typographer: true,
}).use(color, { defaultClassName: 'color' });
// .use(alert)
// .use(attrs)
// .use(container)
// .use(stylize, {
//   config: [
//     {
//       matcher: /^Rye/,
//       replacer: ({ attrs, content }) => ({
//         tag: 'span',
//         attrs: { ...attrs, class: 'red' },
//         content,
//       }),
//     },{
//       matcher: /.+/,
//       replacer: ({content}) => ({tag:'span', content}),
//     }
//   ],
// })

interface RawNews {
  defaults?: {
    year?: string;
    tzOffset?: string;
  };
  news: Record<ShortDateTime, string>; // text is markdown!
}

export interface NewsItem {
  when: DateTime;
  html: string;
}

export const state = createAutoFetchState(
  dataUrl,
  Duration.fromISO('PT30M'),
  initialRawNews as unknown as RawNews,
  massageRawNews
);

function massageRawNews(rawData?: RawNews): NewsItem[] {
  if (!rawData) {
    return [];
  }

  const defaultYear = rawData.defaults?.year;
  const defaultOffset = rawData.defaults?.tzOffset;

  return Object.entries(rawData.news).map(([when, markdown]) => ({
    when: luxonifyShort(when, defaultYear, defaultOffset),
    html: md.render(markdown),
  }));
}
