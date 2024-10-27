import { DateTime, Duration } from 'luxon';
import type { DurationUnit } from 'luxon';
import pluralize from 'pluralize';

import { luxonifyShort, type ShortDateTime } from '$lib/datetime.js';

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

/** A weight in grams. */
export type Weight = number;

/** A nickname. */
export type Nickname = string;

// generate the actual "public" data in a nicely structured form

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
  defaults?: {
    year?: string;
    tzOffset?: string;
  };

  birthInfo: [ShortDateTime, SexKey, ColorKey, Weight, CollarKey, Nickname][];
  weighings: [ShortDateTime, ...Array<Weight>][];
}

export interface PuppyData {
  dogs: DogInfo[];
  latestDate: DateTime;
  future: boolean;
}

export function massageData(rawData: RawPuppyData) {
  const defaultYear = rawData.defaults?.year;
  const defaultOffset = rawData.defaults?.tzOffset;

  // console.log("massaging raw data", rawData);
  const dogs: DogInfo[] = rawData.birthInfo.map(
    ([shortBirthdate, sex, color, birthweight, collar, nickname], i) => {
      // get *this* dog's weights...
      const birthdate = luxonifyShort(
        shortBirthdate,
        defaultYear,
        defaultOffset
      );
      const weights: Weighing[] = rawData.weighings.map(([shortDate, ...w]) => [
        luxonifyShort(shortDate, defaultYear, defaultOffset),
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

  const latestDate = dogs.reduce((memo, dog) => {
    // There is always *at least* one weight...
    const dogLatest = dog.weights.slice(-1)[0][0];
    return DateTime.max(memo, dogLatest);
  }, DateTime.fromMillis(0));
  // // do we ever really use "byCollar"?
  // const byCollar = Object.fromEntries(dogs.map((dog) => [dog.collar, dog]));

  const future = latestDate.diffNow().toMillis() > 0;

  const data: PuppyData = {
    dogs,
    latestDate,
    future,
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

// find GCD using euclidean algorithm...
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
