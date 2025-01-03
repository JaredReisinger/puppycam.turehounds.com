import { expect, test } from 'vitest';
import { DateTime, Duration, type DurationUnit } from 'luxon';

import { humanizeDuration, luxonifyShort } from './datetime.js';

test('luxonifyShort()', () => {
  const actual = luxonifyShort('05-06T12:34', '2021', '-0700');
  const expected = DateTime.fromISO('2021-05-06T12:34:00-0700');
  expect(actual.valueOf()).toBe(expected.valueOf());
});

test('humanizeDuration()', () => {
  const cases: [string, string, boolean][] = [
    ['P1D', '1 day', false],
    ['P2D', '2 days', false],
    ['P1DT23H', '1 day', false],
    ['P1DT24H', '2 days', false],
    ['P7D', '1 week', false],
    ['P8D', '1 week, 1 day', false],
    ['P13D', '1 week, 6 days', false],
    ['P14D', '2 weeks', false],
    ['P15D', '2 weeks, 1 day', false],
    ['P28D', '4 weeks', false],
    ['P29D', '4 weeks, 1 day', false],
    ['P30D', '1 month', false],
    ['P31D', '1 month, 1 day', false],
    ['P32D', '1 month, 2 days', false],
    ['-P32D', '1 month, 2 days', true], // reversed!
  ];

  const units: DurationUnit[] = ['months', 'weeks', 'days'];

  cases.forEach(([iso, expectedText, expectedReversed], i) => {
    const { text, reversed } = humanizeDuration(Duration.fromISO(iso), units);
    const label = `test ${i + 1}: [${iso}, ${JSON.stringify(expectedText)}]`;
    expect(text, label).toBe(expectedText);
    expect(reversed, label).toBe(expectedReversed);
  });
});

test("humanizeDuration() limits", (t) => {
  const cases: [string, DurationUnit[], number, string][] = [
    ['P1DT2H3M', ['day', 'hour', 'minute'], 1, '1 day'],
    ['P1DT2H3M', ['day', 'hour', 'minute'], 2, '1 day, 2 hours'],
    ['P1DT2H3M', ['day', 'hour', 'minute'], 3, '1 day, 2 hours, 3 minutes'],

    // ['P1DT23H', ['day', 'hour', 'minute'], 1, '2 days'], // rounding?
    ['P50DT2H3M', ['month', 'week', 'day', 'hour', 'minute'], 2, '1 month, 3 weeks'],
  ];

  cases.forEach(([iso, units, limit, expected], i) => {
    const {text} = humanizeDuration(Duration.fromISO(iso), units, limit)
    const label = `test ${i + 1}: [${iso}, ${JSON.stringify(expected)}]`;
    expect(text, label).toBe(expected);
  });
});
