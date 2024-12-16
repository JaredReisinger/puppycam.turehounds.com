import { Duration } from 'luxon';

import { createAutoFetchState } from '$lib/autofetch-data.svelte.js';

import { massageData, type RawPuppyData } from '$lib/puppy-data-utils.js';

// @ts-expect-error - ts2307 - no types on YAML
import initialRawData from '$lib/puppy-data.yaml';

export const state = createAutoFetchState(
  '/puppy-data.yaml',
  Duration.fromISO('PT30M'),
  initialRawData as unknown as RawPuppyData,
  massageData
);
