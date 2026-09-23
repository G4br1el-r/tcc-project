export const ANALYTICS_EVENTS = {
  whatsappHeader: "click_whatsapp_header",
  whatsappHero: "click_whatsapp_hero",
  whatsappService: "click_whatsapp_service",
  whatsappProcess: "click_whatsapp_process",
  whatsappFaq: "click_whatsapp_faq",
  heroSecondary: "click_hero_how_it_works",
  whatsappFinal: "click_whatsapp_final",
  faqOpen: "faq_open",
  serviceView: "service_view",
  scrollDepth50: "scroll_depth_50",
  scrollDepth90: "scroll_depth_90",
} as const;

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export type AnalyticsParams = Readonly<
  Record<string, string | number | boolean>
>;

export type AnalyticsTarget = { dataLayer?: unknown[] };

const EVENT_NAMES: ReadonlySet<string> = new Set(
  Object.values(ANALYTICS_EVENTS),
);

export function isAnalyticsEventName(
  value: string | null | undefined,
): value is AnalyticsEventName {
  return typeof value === "string" && EVENT_NAMES.has(value);
}

function browserTarget(): AnalyticsTarget | undefined {
  return typeof window === "undefined" ? undefined : window;
}

export function trackEvent(
  name: AnalyticsEventName,
  params: AnalyticsParams = {},
  target: AnalyticsTarget | undefined = browserTarget(),
): void {
  if (!target) return;
  target.dataLayer ??= [];
  target.dataLayer.push({ event: name, ...params });
}

export const SCROLL_DEPTH_MILESTONES: ReadonlyArray<{
  percent: number;
  event: AnalyticsEventName;
}> = [
  { percent: 50, event: ANALYTICS_EVENTS.scrollDepth50 },
  { percent: 90, event: ANALYTICS_EVENTS.scrollDepth90 },
];

const PERCENT = 100;

export function scrollDepthPercent(
  scrollTop: number,
  viewportHeight: number,
  documentHeight: number,
): number {
  if (documentHeight <= 0) return 0;
  const seen = Math.min(scrollTop + viewportHeight, documentHeight);
  return (seen / documentHeight) * PERCENT;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}
