import { describe, expect, it } from "vitest";
import { formatCount, formatRating } from "./format";

describe("formatCount", () => {
  it("rounds and groups thousands in pt-BR", () => {
    expect(formatCount(1234.6)).toBe("1.235");
  });
});

describe("formatRating", () => {
  it("always shows one decimal with a comma", () => {
    expect(formatRating(4.86)).toBe("4,9");
    expect(formatRating(5)).toBe("5,0");
  });
});
