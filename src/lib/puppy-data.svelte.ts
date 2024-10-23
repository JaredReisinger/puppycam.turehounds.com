import { Duration } from 'luxon';

import { createAutoFetchState } from '$lib/autofetch-data.svelte.js';

import { massageData, type RawPuppyData } from '$lib/puppy-data-utils.js';

import initialRawData from '$lib/puppy-data.json';

export const state = createAutoFetchState(
  '/puppy-data.json',
  Duration.fromISO('PT30M'),
  initialRawData as unknown as RawPuppyData,
  massageData
);
