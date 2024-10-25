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

export function humanizeDuration(duration: Duration, units: DurationUnit[]) {
  let dur = duration;

  if (dur.valueOf() < 0) {
    dur = dur.negate();
  }

  // const units: DurationUnit[] = ["months", "weeks", "days", "hours"];
  const parts: string[] = [];

  units.forEach((unit) => {
    // TODO: perform rounding when we're within 90% of the unit?
    let amount = dur.as(unit);
    if (amount >= 1) {
      amount = Math.floor(amount);
      parts.push(pluralize(unit, amount, true));
      dur = dur.minus({ [unit]: amount });
    }
  });
  return parts.join(', ');
}
