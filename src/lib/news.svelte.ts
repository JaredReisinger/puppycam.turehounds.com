// This is an "auto-updating store" that gets the raw news JSON data
// and massages it into our usable form.  We could theoretically build a
// "self-updating fetch-backed store", but for now this is a one-off (x2).
import { browser } from '$app/environment';
import { DateTime, Duration } from 'luxon';

import { type ShortDateTime, shortToDateTime } from './puppy-data-utils';

// $lib/news.json is a symlink to the *real* static/news.json because vite
// doesn't allow imports of static files
import initialRawNews from '$lib/news.json';

const refreshInterval = Duration.fromISO('PT30M');
const newsUrl = 'news.json';

export type Paragraph = string;

interface RawNewsItem {
  [index: ShortDateTime]: Paragraph[];
}

interface RawNews {
  news: RawNewsItem[];
}

export interface NewsItem {
  when: DateTime;
  paragraphs: Paragraph[];
}

const initialNews = massageRawNews(initialRawNews as unknown as RawNews);

export const news = $state({
  // we should *not* have to indirect through unknown to get the type info, but
  // either vite or typescript gets confused about the incoming data types
  news: initialNews,
  lastChecked: DateTime.local() as DateTime,
  lastModified: initialNews.length > 0 ? initialNews[0].when : undefined,
});

declare global {
  interface Window {
    newsTimer?: NodeJS.Timeout;
  }
}

if (
  browser &&
  typeof setInterval !== 'undefined' &&
  typeof fetch !== 'undefined'
) {
  if (window.newsTimer) {
    // console.log('NEWS - killing old timer...');
    clearInterval(window.newsTimer);
    window.newsTimer = undefined;
  }

  refreshNews();
  window.newsTimer = setInterval(refreshNews, refreshInterval.toMillis());
}

async function refreshNews() {
  const lastChecked = DateTime.local();
  // console.log('FETCHING NEWS...', {at:lastChecked.toISO()});
  const { lastModified, rawNews } = await fetchRawNews();

  news.news = massageRawNews(rawNews);
  news.lastChecked = lastChecked;
  news.lastModified =
    lastModified ?? (news.news.length > 0 ? news.news[0].when : undefined);
}

async function fetchRawNews() {
  const res = await fetch(newsUrl);

  const lastModifiedHeader = res.headers.get('Last-Modified') ?? undefined;
  let lastModified = lastModifiedHeader
    ? DateTime.fromHTTP(lastModifiedHeader)
    : undefined;
  if (lastModified && !lastModified.isValid) {
    lastModified = undefined;
  }

  const rawNews: RawNews = await res.json();

  return { lastModified, rawNews };
}

function massageRawNews(rawNews: RawNews): NewsItem[] {
  return rawNews.news.flatMap((obj) =>
    Object.entries(obj).map(([when, ps]) => ({
      when: shortToDateTime(when),
      paragraphs: ps,
    }))
  );
}
