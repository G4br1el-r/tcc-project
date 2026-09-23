"use client";

import { type ReactNode, useRef } from "react";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";
import { queryAll, queryOne } from "@/lib/dom";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import {
  EASE,
  HIDDEN,
  MEDIA,
  NO_OFFSET,
  SCRUB_SMOOTHING_SECONDS,
  VISIBLE,
} from "@/lib/motion";
import { completeOnFocus, revealAll } from "@/lib/reveal";

const VIEW_LINE = "top 70%";
const CARD_ENTRY_OFFSET = 48;
const CARD_DURATION = 0.9;
const CARD_STAGGER = 0.12;
const MOBILE_REVEAL_START = "top 85%";
const HORIZONTAL_PROGRESS_MIN = 0;
const HORIZONTAL_VIEW_RATIO = 0.6;
const SINGLE_PIXEL = 1;

export function ServicesMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const element = root.current;
      if (!element) return;
      const mm = gsap.matchMedia();
      const cards = queryAll(element, "[data-service]");
      const seen = new Set<string>();

      const trackView = (card: HTMLElement) => {
        const id = card.dataset.service;
        if (!id || seen.has(id)) return;
        seen.add(id);
        trackEvent(ANALYTICS_EVENTS.serviceView, { service_id: id });
      };

      mm.add(MEDIA.desktopMotion, () => {
        const viewport = queryOne(element, "[data-services-viewport]");
        const track = queryOne(element, "[data-services-track]");
        if (!viewport || !track) return;
        revealAll(element);

        const distance = () =>
          Math.max(
            track.scrollWidth - viewport.clientWidth,
            HORIZONTAL_PROGRESS_MIN,
          );

        const scrollToCard = (event: FocusEvent) => {
          if (!(event.target instanceof Element)) return;
          const card = event.target.closest<HTMLElement>("[data-service]");
          const trigger = tween.scrollTrigger;
          if (!card || !trigger) return;
          viewport.scrollLeft = 0;
          const ratio = card.offsetLeft / Math.max(distance(), SINGLE_PIXEL);
          trigger.scroll(trigger.start + ratio * (trigger.end - trigger.start));
        };

        let cardOffsets: number[] = [];
        let viewportWidth = NO_OFFSET;
        const measureCards = () => {
          cardOffsets = cards.map((card) => card.offsetLeft);
          viewportWidth = viewport.clientWidth;
        };

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: EASE.none,
          scrollTrigger: {
            trigger: viewport,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: SCRUB_SMOOTHING_SECONDS,
            invalidateOnRefresh: true,
            onRefresh: measureCards,
            onUpdate: (self) => {
              if (seen.size === cards.length) return;
              const visibleRight =
                self.progress * distance() +
                viewportWidth * HORIZONTAL_VIEW_RATIO;
              cards.forEach((card, index) => {
                if ((cardOffsets[index] ?? card.offsetLeft) < visibleRight) {
                  trackView(card);
                }
              });
            },
          },
        });

        track.addEventListener("focusin", scrollToCard);

        return () => {
          track.removeEventListener("focusin", scrollToCard);
        };
      });

      mm.add(MEDIA.mobileMotion, () => {
        revealAll(element);
        const entry = gsap.fromTo(
          cards,
          { opacity: HIDDEN, y: CARD_ENTRY_OFFSET },
          {
            opacity: VISIBLE,
            y: NO_OFFSET,
            duration: CARD_DURATION,
            stagger: CARD_STAGGER,
            ease: EASE.out,
            scrollTrigger: {
              trigger: queryOne(element, "[data-service]") ?? element,
              start: MOBILE_REVEAL_START,
              toggleActions: "play none none reverse",
            },
          },
        );
        completeOnFocus(element, entry);
        for (const card of cards) {
          ScrollTrigger.create({
            trigger: card,
            start: VIEW_LINE,
            once: true,
            onEnter: () => trackView(card),
          });
        }
      });
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
