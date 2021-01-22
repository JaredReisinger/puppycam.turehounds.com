import test from "ava";
import { DateTime } from "luxon";

import {
  formatPoundsOunces,
  gramsToOunces,
  gramsToPounds,
  shortToDateTime,
} from "./puppy-data-utils";

test("shortToDateTime()", (t) => {
  const actual = shortToDateTime("05-06T12:34");
  const expected = DateTime.fromISO("2021-05-06T12:34:00-0700");
  t.truthy(expected.equals(actual));
});

test("gramsToOunces()", (t) => {
  [
    [0, 0],
    [28, 0.98766976],
    [100, 3.527392],
    [200, 7.054784],
    // regression cases...
    [595, 20.9879824], // 595g => "1 lb 4 1/1 oz"
  ].forEach(([g, oz], i) => {
    t.is(gramsToOunces(g), oz, `test ${i + 1}: [${g}, ${oz}]`);
  });
});

test("gramsToPounds()", (t) => {
  [
    [0, 0],
    [28, 0.06172936],
    [100, 0.220462],
    [200, 0.440924],
    [1000, 2.20462],
    // regression cases...
    [595, 1.3117489], // 595g => "1 lb 4 1/1 oz"
  ].forEach(([g, lb], i) => {
    t.is(gramsToPounds(g), lb, `test ${i + 1}: [${g}, ${lb}]`);
  });
});

test("formatPoundsOunces()", (t) => {
  const cases: [number, string][] = [
    [0, ""],
    [1, "1 lb"],
    [2, "2 lbs"],
    [3.5, "3 lbs 8 oz"],
    [4.25, "4 lbs 4 oz"],
    [5.125, "5 lbs 2 oz"],
    [6.0625, "6 lbs 1 oz"],
    [7.03125, "7 lbs ½ oz"], // fix! (was "7 lbs 0½ oz")
    [8.015625, "8 lbs ¼ oz"],
    [9.0078125, "9 lbs ⅛ oz"],
    // regression cases...
    [1.3117489, "1 lb 5 oz"], // 595g => "1 lb 4 1/1 oz"
  ];
  cases.forEach(([lb, s], i) => {
    t.is(
      formatPoundsOunces(lb),
      s,
      `test ${i + 1}: [${lb}, ${JSON.stringify(s)}]`
    );
  });
});
