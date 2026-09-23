import { SITE_LANGUAGE } from "./site";

const countFormatter = new Intl.NumberFormat(SITE_LANGUAGE);

export function formatCount(value: number): string {
  return countFormatter.format(Math.round(value));
}
