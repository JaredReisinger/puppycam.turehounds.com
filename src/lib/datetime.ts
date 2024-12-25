// utilities for datetime processing
import { DateTime, Duration, type DurationUnit } from 'luxon';
import pluralize from 'pluralize';

/** The standard short date formatting. */
export const shortFmt = {
  ...DateTime.DATETIME_SHORT,
  timeZoneName: 'short',
} as const;

/** The standard long date formatting. */
export const longFmt = {
  ...DateTime.DATETIME_HUGE,
  timeZoneName: 'short',
} as const;

/** A date/time in ISO representation, but *without* the year and offset. */
export type ShortDateTime = string;

// fallbacks in case default values aren't provided
const assumedYear = '2024';
const assumedOffset = '-0700';

/** Converts our short date/time into a real Luxon DateTime. */
export function luxonifyShort(
  input: ShortDateTime,
  defaultYear = assumedYear,
  defaultOffset = assumedOffset
): DateTime {
  // We may add additional short formats in the future; for now we support ISO
  // with/without the year, seconds, and TZ offset.
  if (input.includes('T')) {
    let toParse = input;
    // look for missing year
    if (!toParse.match(/^\d{4}/)) {
      toParse = `${defaultYear}-${toParse}`;
    }

    // should have "YYYY-MM-DDThh:mm" check for ":ss"
    if (toParse.length === 16) {
      toParse = `${toParse}:00`;
    }

    if (toParse.length === 19) {
      toParse = `${toParse}${defaultOffset}`;
    }

    return DateTime.fromISO(toParse);
  }

  // different parsing?
  return DateTime.invalid('unrecognized input');
}

/**
 * Humanizes a duration as text. If "limit" is provided, no more than limit units, starting from the first non-zero one, will be used.
 * @param duration value to humanize
 * @param units units to consider
 * @param limit maximum units to show
 * @returns
 */
export function humanizeDuration(
  duration: Duration,
  units: DurationUnit[],
  limit?: number
) {
  let d = duration;
  let reversed = false;

  if (d.valueOf() < 0) {
    d = d.negate();
    reversed = true;
  }

  const parts: string[] = [];
  let firstUnit: number | undefined;

  units.forEach((unit, i) => {
    // console.log('HUMANIZE', {unit, i, firstUnit, limit});
    if (limit && firstUnit !== undefined && i - firstUnit >= limit) {
      return;
    }

    // TODO: perform rounding when we're within 90% of the unit?
    let amount = d.as(unit);
    if (amount >= 1) {
      firstUnit = firstUnit ?? i;
      amount = Math.floor(amount);
      parts.push(pluralize(unit, amount, true));
      d = d.minus({ [unit]: amount });
    }
  });

  return { text: parts.join(', '), reversed };
}
