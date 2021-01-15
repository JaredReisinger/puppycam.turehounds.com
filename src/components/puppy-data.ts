// I tried using YAML and JSON, but couldn't get the rollup plugin to work. I
// kept seeing "unexpected token (you need a plugin)" despite *having* the
// plugin.  Ah, well... JS works as well... (as does ts!)

import { DateTime } from "luxon";

// There's an interesting set of conflicting constraints: there's enough data
// that it needs to be efficient and non-verbose to author/edit it, *and* it
// needs to be exposed in an easy-to-use format.  To that end, we author it in
// one form, and then expose a transformed version of it.  Types are defined as
// we go, just as they are needed.  By-and-large, the data entry will be done in
// tuples, to vastly reduce the needed typing (on the keyboard, not Typescript
// types).

/** The valid collar colors. */
enum Collar {
  blue,
  red,
  yellow,
  white,
  green,
  pink,
}

/** Collar colors as keys (a set of valid strings) */
type CollarKey = keyof typeof Collar;

// const CollarNames = Object.keys(Collar);
// const CollarCount = CollarNames.length;

const collarCount = 6;

/** Valid sexes. */
const enum Sex {
  M = "M",
  F = "F",
}

// /** Sex as a string value. */
// type SexValue = keyof typeof Sex;

/** Known colors */
const enum Color {
  Red = "Red & White",
  // Tri = "Tri-colored (Black, White, & Tan)",
  Tri = "Tri-colored",
}

// /** Color as a short string */
// type ColorKey = keyof typeof Color;

/** A date/time in ISO representation, but *without* the year and offset. */
type ShortDateTime = string;

const assumedYear = "2021";
const assumedOffset = "-0700";

/** Converts our short date/time into a real Luxon DateTime. */
function shortToDateTime(date: ShortDateTime): DateTime {
  return DateTime.fromISO(`${assumedYear}${date}${assumedOffset}`);
}

/** A weight in grams. */
type Weight = number;

/**
 * The birth info, in compact form.
 *
 * Note that the tuple order was chosen purely to keep the columns lined up.
 */
const birthInfo: [ShortDateTime, Sex, Color, Weight, CollarKey][] = [
  ["01-13T16:13", Sex.F, Color.Red, 231, "blue"],
  ["01-13T16:30", Sex.M, Color.Red, 219, "red"],
  ["01-13T16:42", Sex.F, Color.Red, 219, "yellow"],
  ["01-13T16:54", Sex.F, Color.Red, 224, "white"],
  ["01-13T17:51", Sex.M, Color.Red, 229, "green"],
  ["01-13T19:51", Sex.F, Color.Tri, 215, "pink"],
];

// ===========================================================================
// MAGIC TYPESCRIPT from
// https://stackoverflow.com/questions/41139763/how-to-declare-a-fixed-length-array-in-typescript...
// I'm not sure how this works...
type Grow<T, A extends Array<T>> = ((x: T, ...xs: A) => void) extends (
  ...a: infer X
) => void
  ? X
  : never;
type GrowToSize<T, A extends Array<T>, N extends number> = {
  0: A;
  1: GrowToSize<T, Grow<T, A>, N>;
}[A["length"] extends N ? 0 : 1];

type FixedArray<T, N extends number> = GrowToSize<T, [], N>;
// ===========================================================================

// Weighings (after the birth weight!) are conducted at one point in time, and
// include a weight for each dog in canonical order.
const weighings: [ShortDateTime, ...FixedArray<Weight, 6>][] = [
  ["01-14T09:00", 252, 244, 239, 240, 257, 236],
  ["01-14T23:19", 274, 271, 262, 264, 282, 252],
];

// ===========================================================================
// Now... generate the actual "public" data in a nicely structured form

export type Weighing = [DateTime, Weight];

/** information about a single dog */
export interface DogInfo {
  /** collar color for the dog */
  collar: CollarKey;
  /** hurr... duh, the birthdate */
  birthdate: DateTime;
  /** the sex of the dog */
  sex: Sex;
  /** the color of the dog */
  color: Color;
  /** weight (in grams) at birth */
  birthweight: number;
  /** all weights for this dog */
  weights: Weighing[];
}

const dogs: DogInfo[] = birthInfo.map(
  ([shortBirthdate, sex, color, birthweight, collar]) => {
    // get *this* dog's weights...
    const collarIndex = Collar[collar];
    const birthdate = shortToDateTime(shortBirthdate);
    const weights: Weighing[] = weighings.map(([shortDate, ...w]) => [
      shortToDateTime(shortDate),
      w[collarIndex],
    ]);
    // unshift the birth weight onto the front...
    weights.unshift([birthdate, birthweight]);

    const info: DogInfo = {
      collar,
      birthdate,
      sex,
      color,
      birthweight,
      weights,
    };

    return info;
  }
);

const byCollar = Object.fromEntries(dogs.map((dog) => [dog.collar, dog]));

const data = {
  dogs,
  byCollar,
}

// console.log("DOG INFO", data);

export default data;


const gramsPerOunce = 0.03527392;

export function gramsToOunces(grams: number): number {
  return grams * gramsPerOunce;
}
