import { SITE_LANGUAGE } from "./site";

const RATING_FRACTION_DIGITS = 1;

const countFormatter = new Intl.NumberFormat(SITE_LANGUAGE);
const ratingFormatter = new Intl.NumberFormat(SITE_LANGUAGE, {
  minimumFractionDigits: RATING_FRACTION_DIGITS,
  maximumFractionDigits: RATING_FRACTION_DIGITS,
});

export function formatCount(value: number): string {
  return countFormatter.format(Math.round(value));
}

export function formatRating(value: number): string {
  return ratingFormatter.format(value);
}
