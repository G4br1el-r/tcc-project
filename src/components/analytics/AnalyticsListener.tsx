"use client";

import { useEffect } from "react";
import {
  ANALYTICS_EVENTS,
  isAnalyticsEventName,
  SCROLL_DEPTH_MILESTONES,
  scrollDepthPercent,
  trackEvent,
} from "@/lib/analytics";

function handleClick(event: MouseEvent) {
  if (!(event.target instanceof Element)) return;
  const tracked = event.target.closest<HTMLElement>("[data-track]");
  const name = tracked?.dataset.track;
  if (!tracked || !isAnalyticsEventName(name)) return;
  const id = tracked.dataset.trackId;
  trackEvent(name, id ? { item_id: id } : {});
}

function handleToggle(event: Event) {
  const target = event.target;
  if (!(target instanceof HTMLDetailsElement) || !target.open) return;
  const id = target.dataset.faq;
  if (!id) return;
  trackEvent(ANALYTICS_EVENTS.faqOpen, { item_id: id });
}

export function AnalyticsListener() {
  useEffect(() => {
    const reached = new Set<number>();
    let frame: number | null = null;

    const measure = () => {
      frame = null;
      const root = document.documentElement;
      const percent = scrollDepthPercent(
        window.scrollY,
        window.innerHeight,
        root.scrollHeight,
      );
      for (const milestone of SCROLL_DEPTH_MILESTONES) {
        if (percent >= milestone.percent && !reached.has(milestone.percent)) {
          reached.add(milestone.percent);
          trackEvent(milestone.event);
        }
      }
      if (reached.size === SCROLL_DEPTH_MILESTONES.length) {
        window.removeEventListener("scroll", onScroll);
      }
    };

    const onScroll = () => {
      if (frame === null) frame = window.requestAnimationFrame(measure);
    };

    document.addEventListener("click", handleClick, { capture: true });
    document.addEventListener("toggle", handleToggle, { capture: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
      document.removeEventListener("toggle", handleToggle, { capture: true });
      window.removeEventListener("scroll", onScroll);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
