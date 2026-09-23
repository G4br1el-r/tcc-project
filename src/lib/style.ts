import type { CSSProperties } from "react";

export type CssVariables = Readonly<Record<`--${string}`, string | number>>;

export function cssVars(variables: CssVariables): CSSProperties {
  return variables as CSSProperties;
}
