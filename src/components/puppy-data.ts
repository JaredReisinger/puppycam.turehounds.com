// This is an "auto-updating store" that gets the raw puppy stats JSON data
// and massages it into our usable form.  We could theoretically build a
// "self-updating fetch-backed store", but for now this is a one-off.
import { readable } from "svelte/store";
import { DateTime, Duration } from "luxon";

import { massageData, PuppyData } from "./puppy-data-utils.js";
import type { RawPuppyData } from "./puppy-data-utils.js";

import initialData from "../../static/puppy-data.json";

// console.log("got initial data", initialData);

// *Pages* can expose a "preload" that can take advantage of server-side
// "this.fetch()", but general components can't.  I've gone back and forth
// attempting to find a good way to seed initial data from the server, but
// there's no clean mechanism to propagate a page-preload's "this.fetch" down
// into a component.

const dataUrl = "puppy-data.json";

export interface PuppyDataStore {
  lastChecked: DateTime;
  lastModified: DateTime;
  puppyData: PuppyData;
}

let state: PuppyDataStore = {
  lastChecked: undefined,
  lastModified: undefined,
  puppyData: undefined,
};

state = massageInitialData(initialData as RawPuppyData);

// console.log("initial state", state);

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
      // console.log("PUPPY-DATA: unsubscribe non-refresh case");
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

    immediateRefresh = expectedDelay < (defaultDelay.valueOf() / 4);
  }

  if (immediateRefresh) {
    // console.log("PUPPY-DATA: performing immediate data refresh");
    refreshData(set);
  }

  // Now set up the interval-based refresh...
  const interval = setInterval(() => {
    // console.log("PUPPY-DATA: interval...");
    refreshData(set);
  }, defaultDelay.valueOf());

  // get the data, and set up a refresh every 30 minutes?
  return () => {
    // console.log("PUPPY-DATA: no more subscriptions");
    clearInterval(interval);
  };
});

function canRefreshData() {
  return typeof setTimeout !== "undefined" && typeof fetch !== "undefined";
}

function massageInitialData(rawData: RawPuppyData) {
  const lastChecked = DateTime.local();
  const puppyData = massageData(rawData);
  const lastModified = puppyData.dogs[0].weights.slice(-1)[0][0];

  return {
    lastChecked,
    lastModified,
    puppyData,
  };
}

async function refreshData(set) {
  const lastChecked = DateTime.local();
  const { lastModified, rawData } = await fetchRawData();
  const puppyData = massageData(rawData);

  // mutate state in-place?
  state = {
    lastChecked,
    lastModified,
    puppyData,
  };

  set(state);
}

async function fetchRawData() {
  const res = await fetch(dataUrl);
  const lastModified = DateTime.fromHTTP(res.headers.get("Last-Modified"));
  const rawData: RawPuppyData = await res.json();
  return { lastModified, rawData };
}
