// This is an "auto-updating store" used as the backing state for both news and
// puppy data.  (Maybe it could also front the weather?)
import { browser } from '$app/environment';
import { DateTime, Duration } from 'luxon';
import YAML from 'yaml';

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
  seedData: RawData | undefined,
  massager?: (_: RawData | undefined) => Data,
  debugLogging = false
) {
  if (debugLogging) {
    console.log('AUTO-FETCH - CREATING', {
      url,
      seedData,
      interval: refreshInterval.toISO(),
    });
  }

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
      if (debugLogging) {
        console.log('AUTO-FETCH - CLEARING OLD TIMER', {
          url,
          interval: refreshInterval.toISO(),
        });
      }
      clearInterval(window[sym].timer);
      window[sym].timer = undefined;
    }

    refreshData(state, url, massager, debugLogging);
    window[sym].timer = setInterval(
      refreshData,
      refreshInterval.toMillis(),
      state,
      url,
      massager,
      debugLogging
    );
  }

  return state;
}

async function refreshData<RawData, Data>(
  state: StateData<Data>,
  url: string,
  massager?: (_: RawData | undefined) => Data,
  debugLogging = false
) {
  const lastChecked = DateTime.local();
  const { lastModified, raw } = await fetchRaw<RawData>(url, debugLogging);

  state.data = massager?.(raw) ?? (raw as unknown as Data);
  state.lastChecked = lastChecked;
  state.lastModified = lastModified;

  if (debugLogging) {
    console.log('AUTO-FETCH - REFRESH', {
      url,
      start: lastChecked.toISO(),
      end: DateTime.local().toISO(),
      ...$state.snapshot(state),
    });
  }
}

async function fetchRaw<RawData>(url: string, debugLogging = false) {
  const res = await fetch(url);

  const lastModifiedHeader = res.headers.get('Last-Modified') ?? undefined;
  let lastModified = lastModifiedHeader
    ? DateTime.fromHTTP(lastModifiedHeader)
    : undefined;
  if (lastModified && !lastModified.isValid) {
    lastModified = undefined;
  }

  const contentType = res.headers.get('Content-Type');

  let raw: RawData | undefined = undefined;
  switch (contentType) {
    case 'text/plain; charset=utf-8': // hack for sensors
    case 'application/json':
      raw = await res.json();
      break;
    case 'text/yaml':
      raw = YAML.parse(await res.text());
      break;
  }

  if (debugLogging) {
    console.log('AUTO_FETCH - GOT', { url, contentType, raw });
  }

  return { lastModified, raw };
}
