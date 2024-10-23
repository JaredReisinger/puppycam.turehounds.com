import { createAutoFetchState } from '$lib/autofetch-data.svelte.js';

// This is an "auto-updating store" that gets the raw news JSON data
// and massages it into our usable form.  We could theoretically build a
// "self-updating fetch-backed store", but for now this is a one-off (x2).
// import { browser } from '$app/environment';
import { DateTime, Duration } from 'luxon';

import { type ShortDateTime, shortToDateTime } from './puppy-data-utils';

// $lib/news.json is a symlink to the *real* static/news.json because vite
// doesn't allow imports of static files
import initialRawNews from '$lib/news.json';

const dataUrl = 'news.json'; // need full path?

type Paragraph = string;

interface RawNews {
  news: Record<ShortDateTime, Paragraph[]>[];
}

export interface NewsItem {
  when: DateTime;
  paragraphs: Paragraph[];
}

export const state = createAutoFetchState(
  dataUrl,
  Duration.fromISO('PT30M'),
  initialRawNews as unknown as RawNews,
  massageRawNews
);

function massageRawNews(rawNews: RawNews): NewsItem[] {
  return rawNews.news.flatMap((obj) =>
    Object.entries(obj).map(([when, ps]) => ({
      when: shortToDateTime(when),
      paragraphs: ps,
    }))
  );
}
