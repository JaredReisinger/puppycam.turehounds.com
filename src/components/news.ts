// This is an "auto-updating store" that gets the raw news JSON data
// and massages it into our usable form.  We could theoretically build a
// "self-updating fetch-backed store", but for now this is a one-off (x2).
import { readable } from "svelte/store";
import { DateTime, Duration } from "luxon";

import { shortToDateTime } from "./puppy-data-utils";

import initialNews from "../../static/news.json";

const newsUrl = "news.json";

export interface NewsStore {
  lastChecked: DateTime;
  lastModified: DateTime;
  news: NewsItem[];
}

let state: NewsStore = {
  lastChecked: undefined,
  lastModified: undefined,
  news: undefined,
};

state = massageInitialNews(initialNews);

// console.log("initial news", state);

export type Paragraph = string;

interface RawNewsItem {
  [index: string]: Paragraph[]; // index is actually ShortDateTime!
}

interface RawNews {
  news: RawNewsItem[];
}

export interface NewsItem {
  when: DateTime;
  paragraphs: Paragraph[];
}

const defaultDelay = Duration.fromISO("PT30M"); // every half-hour
// const defaultDelay = Duration.fromISO("PT10S"); // every 10 seconds
// const defaultDelay = Duration.fromISO("PT2S"); // every 2 seconds

export const store = readable(state, (set) => {
  // We have two very distinct paths depending on whether we can really
  // refresh or not.  If we can, we do so and set up auto-refresh.  If we
  // can't, we're pretty much done and will always have the initial state.
  if (!canRefreshData()) {
    // nothing to do for unsubscribe in this case!
    return () => {
      // console.log("NEWS: unsubscribe non-refresh case");
    };
  }

  // We use setInterval to refresh the data periodically.  If we've never seen
  // the data, or if it's been more than 3/4 of the normal refresh time (if the
  // expected refresh is in the past, or within 1/4 of the delay in the future),
  // we'll also perform an immedate refresh.
  let immediateRefresh = true;

  if (state.lastChecked) {
    const nextCheck = state.lastChecked.plus(defaultDelay);
    const expectedDelay = nextCheck.diffNow().valueOf();

    immediateRefresh = expectedDelay < defaultDelay.valueOf() / 4;
  }

  if (immediateRefresh) {
    // console.log("NEWS: performing immediate data refresh");
    refreshNews(set);
  }

  // Now set up the interval-based refresh...
  const interval = setInterval(() => {
    // console.log("NEWS: interval...");
    refreshNews(set);
  }, defaultDelay.valueOf());

  // get the data, and set up a refresh every 30 minutes?
  return () => {
    // console.log("NEWS: no more subscriptions");
    clearInterval(interval);
  };
});

function canRefreshData() {
  return typeof setTimeout !== "undefined" && typeof fetch !== "undefined";
}

async function refreshNews(set) {
  const lastChecked = DateTime.local();
  const { lastModified, rawNews } = await fetchRawNews();
  const news = massageNews(rawNews);

  // mutate state in-place?
  state = {
    lastChecked,
    lastModified,
    news,
  };

  set(state);
}

async function fetchRawNews() {
  const res = await fetch(newsUrl);
  const lastModified = DateTime.fromHTTP(res.headers.get("Last-Modified"));
  const rawNews: RawNews = await res.json();
  return { lastModified, rawNews };
}

function massageInitialNews(rawNews: RawNews) {
  const lastChecked = DateTime.local();
  const news = massageNews(rawNews);
  const lastModified = news.slice(-1)[0].when;

  return {
    lastChecked,
    lastModified,
    news,
  };
}

function massageNews(rawNews: RawNews) {
  return rawNews.news.flatMap((obj) =>
    Object.entries(obj).map(([when, ps]) => ({
      when: shortToDateTime(when),
      paragraphs: ps,
    }))
  );
}
