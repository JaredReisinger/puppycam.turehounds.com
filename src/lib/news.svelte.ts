import { createAutoFetchState } from '$lib/autofetch-data.svelte.js';

// This is an "auto-updating store" that gets the raw news JSON data
// and massages it into our usable form.  We could theoretically build a
// "self-updating fetch-backed store", but for now this is a one-off (x2).
// import { browser } from '$app/environment';
import { DateTime, Duration } from 'luxon';

import { luxonifyShort, type ShortDateTime } from '$lib/datetime.js';

// @ts-expect-error - ts2307 - no type on YAML
import initialRawNews from '$lib/news.yaml';

const dataUrl = 'news.yaml'; // need full path?

type Paragraph = string;

interface RawNews {
  defaults?: {
    year?: string;
    tzOffset?: string;
  };
  news: Record<ShortDateTime, Paragraph[]>;
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

function massageRawNews(rawData?: RawNews): NewsItem[] {
  if (!rawData) {
    return [];
  }
  
  const defaultYear = rawData.defaults?.year;
  const defaultOffset = rawData.defaults?.tzOffset;

  return Object.entries(rawData.news).map(([when, paragraphs]) => ({
    when: luxonifyShort(when, defaultYear, defaultOffset),
    paragraphs,
  }));
}
