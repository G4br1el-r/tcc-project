import { describe, expect, it } from "vitest";
import {
  ANALYTICS_EVENTS,
  type AnalyticsTarget,
  isAnalyticsEventName,
  scrollDepthPercent,
  trackEvent,
} from "./analytics";

describe("trackEvent", () => {
  it("creates the dataLayer and pushes the event with params", () => {
    const target: AnalyticsTarget = {};
    trackEvent(ANALYTICS_EVENTS.whatsappHero, { item_id: "hero" }, target);
    expect(target.dataLayer).toEqual([
      { event: "click_whatsapp_hero", item_id: "hero" },
    ]);
  });

  it("appends to an existing dataLayer", () => {
    const target: AnalyticsTarget = { dataLayer: [{ event: "gtm.js" }] };
    trackEvent(ANALYTICS_EVENTS.faqOpen, {}, target);
    expect(target.dataLayer).toHaveLength(2);
  });

  it("is a no-op without a target", () => {
    expect(() =>
      trackEvent(ANALYTICS_EVENTS.faqOpen, {}, undefined),
    ).not.toThrow();
  });
});

describe("isAnalyticsEventName", () => {
  it("accepts only known events", () => {
    expect(isAnalyticsEventName("click_whatsapp_final")).toBe(true);
    expect(isAnalyticsEventName("click_random")).toBe(false);
    expect(isAnalyticsEventName(undefined)).toBe(false);
  });
});

describe("scrollDepthPercent", () => {
  it("measures the bottom edge of the viewport", () => {
    expect(scrollDepthPercent(0, 500, 2000)).toBe(25);
    expect(scrollDepthPercent(1500, 500, 2000)).toBe(100);
  });

  it("clamps overscroll and guards against empty documents", () => {
    expect(scrollDepthPercent(3000, 500, 2000)).toBe(100);
    expect(scrollDepthPercent(0, 500, 0)).toBe(0);
  });
});
