import { describe, expect, it } from "vitest";
import { MEDIA, readDegrees } from "./motion";

describe("readDegrees", () => {
  it("parses css degree strings", () => {
    expect(readDegrees("-4deg")).toBe(-4);
    expect(readDegrees("3.5deg")).toBe(3.5);
  });

  it("falls back to no rotation", () => {
    expect(readDegrees(undefined)).toBe(0);
    expect(readDegrees("abc")).toBe(0);
  });
});

describe("MEDIA", () => {
  it("gates every motion query behind reduced-motion preference", () => {
    for (const query of Object.values(MEDIA)) {
      expect(query).toContain("prefers-reduced-motion: no-preference");
    }
  });
});
