"use client";

import { type ReactNode, useRef } from "react";
import { queryAll, queryOne } from "@/lib/dom";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import {
  EASE,
  HIDDEN,
  MEDIA,
  NO_OFFSET,
  SCRUB_SMOOTHING_SECONDS,
  VISIBLE,
} from "@/lib/motion";
import { revealAll, revealFades } from "@/lib/reveal";

const CHAR_HIDDEN_PERCENT = 110;
const MASK_BLEED_EM = "0.14em";
const TRANSITION_VIEWPORT_RATIO = 0.45;
const TRAVEL_DURATION = 1;
const CHARS_OUT_DURATION = 0.4;
const CHARS_IN_AT = 0.45;
const CHARS_IN_DURATION = 0.55;
const CHAR_STAGGER_AMOUNT = 0.25;
const INTRO_FADE_DURATION = 0.3;
const INTRO_IN_AT = 0.7;
const RAIL_ENTRY_OFFSET = 48;
const RAIL_ENTRY_DURATION = 1;
const RAIL_ENTRY_START = "top 75%";
const STEP_ACTIVE_LINE = "top 75%";
const ACTIVE_ATTRIBUTE = "data-active";
const FILL_PROPERTY = "--fill";
const EMPTY = 0;
const FULL = 1;
const FIRST_CHAPTER = 0;
const SIDES = 2;

export function ChaptersMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const element = root.current;
      if (!element) return;
      const mm = gsap.matchMedia();

      const refreshOnToggle = (event: Event) => {
        if (event.target instanceof HTMLDetailsElement) ScrollTrigger.refresh();
      };
      element.addEventListener("toggle", refreshOnToggle, { capture: true });

      mm.add(MEDIA.mobileMotion, () => {
        revealAll(element);
      });

      mm.add(MEDIA.desktopMotion, () => {
        const wrapper = queryOne(element, "[data-chapters]");
        const rail = queryOne(element, "[data-rail]");
        const track = queryOne(element, "[data-rail-track]");
        const panel = queryOne(element, "[data-rail-panel]");
        if (!wrapper || !rail || !track || !panel) return;

        const titles = queryAll(element, "[data-rail-title]");
        const intros = queryAll(element, "[data-rail-intro]");
        const bars = queryAll(element, "[data-rail-bar]");
        const blocks = queryAll(element, "[data-chapter]");
        const steps = queryAll(element, "[data-process-step]");

        for (const body of queryAll(element, "[data-chapter-body]")) {
          revealFades(body);
        }

        const splits = titles.map((title) =>
          SplitText.create(title, { type: "words,chars", mask: "words" }),
        );
        for (const split of splits) {
          gsap.set(split.masks, {
            paddingBlock: MASK_BLEED_EM,
            marginBlock: `-${MASK_BLEED_EM}`,
          });
        }

        splits.forEach((split, index) => {
          gsap.set(split.chars, {
            yPercent: index === FIRST_CHAPTER ? NO_OFFSET : CHAR_HIDDEN_PERCENT,
          });
        });
        gsap.set(titles, { opacity: VISIBLE });
        intros.forEach((intro, index) => {
          gsap.set(intro, {
            opacity: index === FIRST_CHAPTER ? VISIBLE : HIDDEN,
          });
        });
        bars.forEach((bar, index) => {
          gsap.set(bar, {
            [FILL_PROPERTY]: index === FIRST_CHAPTER ? FULL : EMPTY,
          });
        });

        const travel = () =>
          Math.max(track.clientWidth - panel.offsetWidth, NO_OFFSET);
        const sideX = (index: number) =>
          index % SIDES === FIRST_CHAPTER ? NO_OFFSET : travel();
        const railTop = () =>
          Number.parseFloat(getComputedStyle(rail).top) || NO_OFFSET;

        gsap.set(panel, { x: NO_OFFSET });

        gsap.fromTo(
          rail,
          { opacity: HIDDEN, y: RAIL_ENTRY_OFFSET },
          {
            opacity: VISIBLE,
            y: NO_OFFSET,
            duration: RAIL_ENTRY_DURATION,
            ease: EASE.out,
            scrollTrigger: {
              trigger: wrapper,
              start: RAIL_ENTRY_START,
              toggleActions: "play none none reverse",
            },
          },
        );

        blocks.forEach((block, index) => {
          const next = index + FULL;
          const incoming = splits[next];
          const outgoing = splits[index];
          if (!incoming || !outgoing) return;

          gsap
            .timeline({
              defaults: { ease: EASE.none, immediateRender: false },
              scrollTrigger: {
                trigger: block,
                start: () => `bottom top+=${railTop()}`,
                end: () =>
                  `+=${window.innerHeight * TRANSITION_VIEWPORT_RATIO}`,
                scrub: SCRUB_SMOOTHING_SECONDS,
                invalidateOnRefresh: true,
              },
            })
            .fromTo(
              panel,
              { x: () => sideX(index) },
              {
                x: () => sideX(next),
                duration: TRAVEL_DURATION,
                ease: EASE.inOut,
              },
              NO_OFFSET,
            )
            .fromTo(
              outgoing.chars,
              { yPercent: NO_OFFSET },
              {
                yPercent: -CHAR_HIDDEN_PERCENT,
                duration: CHARS_OUT_DURATION,
                ease: "power2.in",
                stagger: { amount: CHAR_STAGGER_AMOUNT },
              },
              NO_OFFSET,
            )
            .fromTo(
              intros[index] ?? [],
              { opacity: VISIBLE },
              { opacity: HIDDEN, duration: INTRO_FADE_DURATION },
              NO_OFFSET,
            )
            .fromTo(
              incoming.chars,
              { yPercent: CHAR_HIDDEN_PERCENT },
              {
                yPercent: NO_OFFSET,
                duration: CHARS_IN_DURATION,
                ease: EASE.out,
                stagger: { amount: CHAR_STAGGER_AMOUNT },
              },
              CHARS_IN_AT,
            )
            .fromTo(
              intros[next] ?? [],
              { opacity: HIDDEN },
              { opacity: VISIBLE, duration: INTRO_FADE_DURATION },
              INTRO_IN_AT,
            )
            .fromTo(
              bars[next] ?? [],
              { [FILL_PROPERTY]: EMPTY },
              { [FILL_PROPERTY]: FULL, duration: TRAVEL_DURATION },
              NO_OFFSET,
            );
        });

        for (const step of steps) {
          ScrollTrigger.create({
            trigger: step,
            start: STEP_ACTIVE_LINE,
            onEnter: () => step.setAttribute(ACTIVE_ATTRIBUTE, ""),
            onLeaveBack: () => step.removeAttribute(ACTIVE_ATTRIBUTE),
          });
        }

        return () => {
          for (const step of steps) step.removeAttribute(ACTIVE_ATTRIBUTE);
          for (const split of splits) split.revert();
        };
      });

      return () => {
        element.removeEventListener("toggle", refreshOnToggle, {
          capture: true,
        });
      };
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
