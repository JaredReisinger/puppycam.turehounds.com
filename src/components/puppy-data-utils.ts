import { DateTime } from "luxon";

/** The valid collar colors. */
export enum Collar {
  blue,
  red,
  yellow,
  white,
  green,
  pink,
}

/** Collar colors as keys (a set of valid strings) */
export type CollarKey = keyof typeof Collar;

/** Valid sexes. */
export enum Sex {
  M = "M",
  F = "F",
}

/** Sex as a string value. */
export type SexKey = keyof typeof Sex;

/** Known colors */
export enum Color {
  Red = "Red & White",
  // Tri = "Tri-colored (Black, White, & Tan)",
  Tri = "Tri-colored",
}

/** Color as a short string */
export type ColorKey = keyof typeof Color;

/** A date/time in ISO representation, but *without* the year and offset. */
export type ShortDateTime = string;

const assumedYear = "2021";
const assumedOffset = "-0700";

/** Converts our short date/time into a real Luxon DateTime. */
function shortToDateTime(date: ShortDateTime): DateTime {
  return DateTime.fromISO(`${assumedYear}${date}${assumedOffset}`);
}

/** A weight in grams. */
export type Weight = number;

// ===========================================================================
// MAGIC TYPESCRIPT from
// https://stackoverflow.com/questions/41139763/how-to-declare-a-fixed-length-array-in-typescript...
// I'm not sure how this works...
export type Grow<T, A extends Array<T>> = ((x: T, ...xs: A) => void) extends (
  ...a: infer X
) => void
  ? X
  : never;

export type GrowToSize<T, A extends Array<T>, N extends number> = {
  0: A;
  1: GrowToSize<T, Grow<T, A>, N>;
}[A["length"] extends N ? 0 : 1];

export type FixedArray<T, N extends number> = GrowToSize<T, [], N>;
// ===========================================================================

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

// There's an interesting set of conflicting constraints: there's enough data
// that it needs to be efficient and non-verbose to author/edit it, *and* it
// needs to be exposed in an easy-to-use format.  To that end, we author it in
// one form, and then expose a transformed version of it.  Types are defined
// as we go, just as they are needed.  By-and-large, the data entry will be
// done in tuples, to vastly reduce the needed typing (on the keyboard, not
// Typescript types).

export interface RawPuppyData {
  birthInfo: [ShortDateTime, SexKey, ColorKey, Weight, CollarKey][];
  // We can't really assume a fixed-size if it's coming from external JSON,
  // can we (should we)?
  weighings: [ShortDateTime, ...FixedArray<Weight, 6>][];
}

export interface PuppyData {
    dogs: DogInfo[];
}

export function massageData(rawData: RawPuppyData) {
  // console.log("massaging raw data", rawData);
  const dogs: DogInfo[] = rawData.birthInfo.map(
    ([shortBirthdate, sex, color, birthweight, collar], i) => {
      // get *this* dog's weights...
      const birthdate = shortToDateTime(shortBirthdate);
      const weights: Weighing[] = rawData.weighings.map(([shortDate, ...w]) => [
        shortToDateTime(shortDate),
        w[i],
      ]);
      // unshift the birth weight onto the front...
      weights.unshift([birthdate, birthweight]);

      const info: DogInfo = {
        collar,
        birthdate,
        sex: Sex[sex],
        color: Color[color],
        birthweight,
        weights,
      };

      return info;
    }
  );

  // // do we ever really use "byCollar"?
  // const byCollar = Object.fromEntries(dogs.map((dog) => [dog.collar, dog]));

  const data: PuppyData = {
    dogs,
  };

  return data;
}

const gramsPerOunce = 0.03527392;

export function gramsToOunces(grams: number): number {
  return grams * gramsPerOunce;
}

export function capitalize(s: string): string {
  return `${s[0].toUpperCase()}${s.substring(1)}`;
}

export function properName(dog: DogInfo): string {
  return `${dog.sex === Sex.M ? "Mr." : "Miss"} ${capitalize(dog.collar)}`;
}
