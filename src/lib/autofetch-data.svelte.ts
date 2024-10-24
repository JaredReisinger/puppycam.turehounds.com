// This is an "auto-updating store" used as the backing state for both news and
// puppy data.  (Maybe it could also front the weather?)
import { browser } from '$app/environment';
import { DateTime, Duration } from 'luxon';

// At a high level, it takes a data URL and refresh frequency, and returns a
// $state that contains the fetched data and lastCheck/lastUpdate times.  It
// also takes an optional data massager to adjust the JSON before storing it in
// the state (should the caller just expose derived state instead?) and optional
// seed data to avoid an initial "empty" state.
//
// It does *not* currently do any subscribe/unsubscribe performance enhancements
// to avoid making periodic fetch calls when there are no listeners.  That
// functionality only exists in old-style stores, not the new-style $state rune.

interface StateData<Data> {
  data: Data;
  lastModified?: DateTime;
  lastChecked?: DateTime;
}

interface TimerInfo {
  timer?: NodeJS.Timeout;
}

declare global {
  interface Window {
    [index: symbol]: TimerInfo;
  }
}

export function createAutoFetchState<RawData, Data = RawData>(
  url: string,
  refreshInterval: Duration,
  seedData: RawData,
  massager?: (_: RawData) => Data
) {
  // console.log('AUTO-FETCH - CREATING', {url, interval: refreshInterval.toISO() });

  const state = $state<StateData<Data>>({
    // if there's no massager, Data === RawData... do we need to hack around TS
    // for that?
    data: massager?.(seedData) ?? (seedData as unknown as Data),
    lastModified: undefined,
    lastChecked: undefined,
  });

  // Set up the auto-fetch logic, but only in the browser
  if (browser) {
    const sym = Symbol.for(url);
    window[sym] ??= {};

    if (window[sym].timer) {
      // console.log('AUTO-FETCH - CLEARING OLD TIMER', {url, interval: refreshInterval.toISO() });
      clearInterval(window[sym].timer);
      window[sym].timer = undefined;
    }

    refreshData(state, url, massager);
    window[sym].timer = setInterval(
      refreshData,
      refreshInterval.toMillis(),
      state,
      url,
      massager
    );
  }

  return state;
}

async function refreshData<RawData, Data>(
  state: StateData<Data>,
  url: string,
  massager?: (_: RawData) => Data
) {
  const lastChecked = DateTime.local();
  // console.log('FETCHING NEWS...', {at:lastChecked.toISO()});
  const { lastModified, raw } = await fetchRaw<RawData>(url);

  state.data = massager?.(raw) ?? (raw as unknown as Data);
  state.lastChecked = lastChecked;
  state.lastModified = lastModified;

  // console.log('AUTO-FETCH - REFRESH', {url, ...state });
}

async function fetchRaw<RawData>(url: string) {
  const res = await fetch(url);

  const lastModifiedHeader = res.headers.get('Last-Modified') ?? undefined;
  let lastModified = lastModifiedHeader
    ? DateTime.fromHTTP(lastModifiedHeader)
    : undefined;
  if (lastModified && !lastModified.isValid) {
    lastModified = undefined;
  }

  const raw: RawData = await res.json();

  return { lastModified, raw };
}
