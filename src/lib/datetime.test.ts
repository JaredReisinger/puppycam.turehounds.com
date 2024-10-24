import { expect, test } from 'vitest';
import { DateTime, Duration, type DurationUnit } from 'luxon';

import { humanizeDuration, luxonifyShort } from './datetime.js';

test("luxonifyShort()", () => {
  const actual = luxonifyShort("05-06T12:34", "2021", "-0700");
  const expected = DateTime.fromISO("2021-05-06T12:34:00-0700");
  expect(actual.valueOf()).toBe(expected.valueOf());
});

test('humanizeDuration()', () => {
  const cases: [string, string][] = [
    ['P1D', '1 day'],
    ['P2D', '2 days'],
    ['P1DT23H', '1 day'],
    ['P1DT24H', '2 days'],
    ['P7D', '1 week'],
    ['P8D', '1 week, 1 day'],
    ['P13D', '1 week, 6 days'],
    ['P14D', '2 weeks'],
    ['P15D', '2 weeks, 1 day'],
    ['P28D', '4 weeks'],
    ['P29D', '4 weeks, 1 day'],
    ['P30D', '1 month'],
    ['P31D', '1 month, 1 day'],
    ['P32D', '1 month, 2 days'],
  ];

  const units: DurationUnit[] = ['months', 'weeks', 'days'];

  cases.forEach(([iso, expected], i) => {
    expect(
      humanizeDuration(Duration.fromISO(iso), units),
      `test ${i + 1}: [${iso}, ${JSON.stringify(expected)}]`
    ).toBe(expected);
  });
});
