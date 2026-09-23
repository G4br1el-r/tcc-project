import { describe, expect, it } from "vitest";
import { hasOrderChanged, isSameIdSet, mergeOrder } from "./reorder";

const ITEMS = ["a", "b", "c"] as const;

describe("isSameIdSet", () => {
  it("accepts the same ids in any order", () => {
    expect(isSameIdSet(ITEMS, ["c", "a", "b"])).toBe(true);
    expect(isSameIdSet(ITEMS, ITEMS)).toBe(true);
  });

  it("rejects missing or extra ids", () => {
    expect(isSameIdSet(ITEMS, ["a", "b"])).toBe(false);
    expect(isSameIdSet(ITEMS, ["a", "b", "c", "d"])).toBe(false);
  });

  it("rejects unknown ids", () => {
    expect(isSameIdSet(ITEMS, ["a", "b", "z"])).toBe(false);
  });

  it("rejects duplicated ids", () => {
    expect(isSameIdSet(ITEMS, ["a", "a", "b"])).toBe(false);
  });
});

describe("hasOrderChanged", () => {
  it("is false for the same order", () => {
    expect(hasOrderChanged(ITEMS, ["a", "b", "c"])).toBe(false);
  });

  it("is true when positions differ", () => {
    expect(hasOrderChanged(ITEMS, ["b", "a", "c"])).toBe(true);
  });

  it("is true when lengths differ", () => {
    expect(hasOrderChanged(ITEMS, ["a", "b"])).toBe(true);
  });
});

describe("mergeOrder", () => {
  it("keeps the local order for known ids", () => {
    expect(mergeOrder(["c", "a", "b"], ITEMS)).toEqual(["c", "a", "b"]);
  });

  it("drops ids removed on the server", () => {
    expect(mergeOrder(["c", "a", "b"], ["a", "c"])).toEqual(["c", "a"]);
  });

  it("appends ids created on the server", () => {
    expect(mergeOrder(["b", "a"], ["a", "b", "d"])).toEqual(["b", "a", "d"]);
  });
});
