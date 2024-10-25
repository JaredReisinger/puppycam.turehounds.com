import { createAutoFetchState } from '$lib/autofetch-data.svelte.js';

// This is an "auto-updating store" that gets the raw news JSON data
// and massages it into our usable form.  We could theoretically build a
// "self-updating fetch-backed store", but for now this is a one-off (x2).
// import { browser } from '$app/environment';
import { DateTime, Duration } from 'luxon';

const dataUrl = 'https://sensors.turehounds.com/sensors';

// {
//   puppyroom: {
//     altitude: 0,
//     barometric_pressure: 0,
//     dewpoint: 42.82,
//     humidity: 24.4,
//     observed: '2024-10-24T23:46:55Z',
//     temperature: 82.92,
//     vpd: 2.88,
//   },
// }

interface RawData {
  puppyroom: {
    altitude: number;
    barometric_pressure: number;
    dewpoint: number;
    humidity: number;
    observed: string; // ISO timestamp
    temperature: number;
    vpd: number;
  };
}

interface Data {
  temperature?: number;
  humidity?: number;
  observed?: DateTime;
}

export const state = createAutoFetchState(
  dataUrl,
  Duration.fromISO('PT30S'),
  undefined,
  massageData,
  true
);

function massageData(rawData?: RawData): Data {
  if (!rawData) {
    return {};
  }

  const {temperature, humidity, observed} = rawData.puppyroom;
  return {
    temperature,
    humidity,
    observed: DateTime.fromISO(observed),
  };
}
