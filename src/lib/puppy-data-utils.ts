import { DateTime, Duration } from 'luxon';
import type { DurationUnit } from 'luxon';
import pluralize from 'pluralize';

/** The valid collar colors. */
export enum Collar {
  blue,
  red,
  yellow,
  white,
  green,
  pink,
  purple,
  // others?
}

/** Collar colors as keys (a set of valid strings) */
export type CollarKey = keyof typeof Collar;

/** Valid sexes. */
export enum Sex {
  M = 'M',
  F = 'F',
}

/** Sex as a string value. */
export type SexKey = keyof typeof Sex;

/** Known colors */
export enum Color {
  Red = 'Red & White',
  // Tri = "Tri-colored (Black, White, & Tan)",
  Tri = 'Tri-colored',
}

/** Color as a short string */
export type ColorKey = keyof typeof Color;

/** A date/time in ISO representation, but *without* the year and offset. */
export type ShortDateTime = string;

const assumedYear = '2024';
const assumedOffset = '-0700';

/** Converts our short date/time into a real Luxon DateTime. */
export function shortToDateTime(date: ShortDateTime): DateTime {
  // short formats: "06-06T12:00", "2021-06-06T12:00"
  // long format: "2021-06-06T12:00-0700"
  return DateTime.fromISO(
    `${date.length < 16 ? assumedYear : ''}${date}${date.length < 21 ? assumedOffset : ''}`
  );
}

/** A weight in grams. */
export type Weight = number;

/** A nickname. */
export type Nickname = string;

// // ===========================================================================
// // MAGIC TYPESCRIPT from
// // https://stackoverflow.com/questions/41139763/how-to-declare-a-fixed-length-array-in-typescript...
// // I'm not sure how this works...
// export type Grow<T, A extends Array<T>> = ((x: T, ...xs: A) => void) extends (
//   ...a: infer X
// ) => void
//   ? X
//   : never;

// export type GrowToSize<T, A extends Array<T>, N extends number> = {
//   0: A;
//   1: GrowToSize<T, Grow<T, A>, N>;
// }[A["length"] extends N ? 0 : 1];

// export type FixedArray<T, N extends number> = GrowToSize<T, [], N>;
// // ===========================================================================

// ===========================================================================
// Now... generate the actual "public" data in a nicely structured form

export type Weighing = [DateTime, Weight];

/** information about a single dog */
export interface DogInfo {
  /** nickname for the dog */
  nickname: Nickname;
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
  birthInfo: [ShortDateTime, SexKey, ColorKey, Weight, CollarKey, Nickname][];
  // We can't really assume a fixed-size if it's coming from external JSON,
  // can we (should we)?
  weighings: [ShortDateTime, ...Array<Weight>][];
  // weighings: [ShortDateTime, ...FixedArray<Weight, 6>][];
}

export interface PuppyData {
  dogs: DogInfo[];
}

export function massageData(rawData: RawPuppyData) {
  // console.log("massaging raw data", rawData);
  const dogs: DogInfo[] = rawData.birthInfo.map(
    ([shortBirthdate, sex, color, birthweight, collar, nickname], i) => {
      // get *this* dog's weights...
      const birthdate = shortToDateTime(shortBirthdate);
      const weights: Weighing[] = rawData.weighings.map(([shortDate, ...w]) => [
        shortToDateTime(shortDate),
        w[i],
      ]);
      // unshift the birth weight onto the front...
      weights.unshift([birthdate, birthweight]);

      const info: DogInfo = {
        nickname,
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

export function gramsToPounds(grams: number): number {
  return gramsToOunces(grams) / 16;
}

export function formatGramsAsPounds(grams: number): string {
  // let ounces = gramsToOunces(grams);
  // let pounds = Math.floor(ounces / 16);
  // ounces = ounces - pounds * 16;

  // const parts: string[] = [];

  // if (pounds) {
  //   parts.push(pluralize("lb", pounds, true));
  // }

  // if (ounces) {
  //   const whole = Math.floor(ounces);
  //   const fraction = asFraction(ounces - whole, 8);

  //   let fractionText = "";
  //   if (fraction) {
  //     fractionText = fraction.unicode || `${whole ? " " : ""}${fraction.plain}`;
  //   }
  //   parts.push(`${whole}${fractionText} oz`);
  // }

  // return parts.join(" ");
  return formatPoundsOunces(gramsToPounds(grams));
}

export function formatPoundsOunces(pounds: number): string {
  // in order to round to the nearest 1/8th ounce, we *add* 1/16th of an ounce,
  // and then account for any "negative" leftovers...
  const wholePounds = Math.floor(pounds + 1 / 16 / 16);
  const ounces = Math.max((pounds - wholePounds) * 16, 0);

  const parts: string[] = [];

  if (wholePounds) {
    parts.push(pluralize('lb', wholePounds, true));
  }

  if (ounces) {
    const wholeOunces = Math.floor(ounces + 1 / 16);
    const fraction = asFraction(Math.max(ounces - wholeOunces, 0), 8);
    // console.log("ounce parts", { ounces, wholeOunces, fraction });

    let fractionText = '';
    if (fraction) {
      fractionText =
        fraction.unicode || `${wholeOunces ? ' ' : ''}${fraction.plain}`;
    }
    parts.push(`${wholeOunces ? wholeOunces : ''}${fractionText} oz`);
  }

  return parts.join(' ');
}

const unicodeFractions: Record<string, string> = {
  '1/8': '⅛',
  '1/4': '¼',
  '3/8': '⅜',
  '1/2': '½',
  '5/8': '⅝',
  '3/4': '¾',
  '7/8': '⅞',
};

export function asFraction(
  decimal: number,
  denominatorMax: number,
  reduce = true
): { plain: string; unicode: string } | null {
  let denominator = denominatorMax;
  let numerator = Math.round(decimal * denominator);

  if (!numerator) {
    return null;
  }

  if (reduce) {
    // Should find GCD,
    const gcd = findGCD(denominator, numerator);
    numerator /= gcd;
    denominator /= gcd;
  }

  const plain = `${numerator}/${denominator}`;

  return { plain, unicode: unicodeFractions[plain] };
}

// find GCD using euclidean algorihm...
function findGCD(a: number, b: number): number {
  if (a === 0 || b === 0) {
    return b || a;
  }

  if (a < b) {
    return findGCD(b, a);
  }

  return findGCD(b, a % b);
}

export function capitalize(s: string): string {
  return `${s[0].toUpperCase()}${s.substring(1)}`;
}

export function properName(dog: DogInfo): string {
  if (dog.nickname) {
    return dog.nickname;
  }

  return `${dog.sex === Sex.M ? 'Mr.' : 'Miss'} ${capitalize(dog.collar)}`;
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
