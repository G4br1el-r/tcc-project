"use client";

import { type ReactNode, useRef } from "react";
import { queryAll, queryOne } from "@/lib/dom";
import { gsap, useGSAP } from "@/lib/gsap";
import {
  EASE,
  HIDDEN,
  MEDIA,
  NATURAL_SCALE,
  NO_OFFSET,
  NO_ROTATION,
  readConditions,
  readDegrees,
  SCRUB_SMOOTHING_SECONDS,
  VISIBLE,
} from "@/lib/motion";

const DESKTOP_PIN_DISTANCE = "+=560%";
const MOBILE_PIN_DISTANCE = "+=240%";

const WORDS_TOTAL_DURATION = 4.2;
const WORD_IN_DURATION = 0.6;
const WORD_ENTRY_SCALE = 0.5;
const WORD_ENTRY_ROTATION_FACTOR = 3;
const PRESSURE_SCALE = 1.14;
const PRESSURE_DURATION = 0.7;
const PRESSURE_SHAKE = "random(-14, 14)";
const PRESSURE_SHAKE_SMALL = "random(-8, 8)";
const SILENCE_DURATION = 1.1;
const SILENCE_SPREAD = 1.9;
const SILENCE_SCALE = 1.7;
const SILENCE_STAGGER = 0.35;
const TITLE_ENTRY_SCALE = 0.9;
const TITLE_IN_DURATION = 1.2;
const TITLE_HOLD = 1;
const TITLE_EXIT_OFFSET_PERCENT = -20;
const TITLE_EXIT_DURATION = 0.8;
const ORDER_ENTRY_OFFSET = 40;
const ORDER_IN_DURATION = 0.8;
const STEP_STAGGER = 0.18;
const HEADING_IN_DURATION = 1.2;
const HEADING_STAGGER = 0.6;
const FLOW_PAUSE = 0.5;
const STEP_INTERVAL = 1.3;
const STEP_IN_DURATION = 1;
const HOLD_DURATION = 1.5;
const HALF = 0.5;

const MOBILE_REVEAL_START = "top 80%";
const MOBILE_FLOW_START = "top 70%";
const MOBILE_FLOW_END = "bottom 60%";

function anchorPercent(_index: number, target: HTMLElement): number {
  return -Number.parseFloat(target.dataset.x ?? "") || NO_OFFSET;
}

function center(element: Element): { x: number; y: number } {
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width * HALF, y: rect.top + rect.height * HALF };
}

export function ChaosToOrderMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const element = root.current;
      if (!element) return;
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktopMotion: MEDIA.desktopMotion,
          mobileMotion: MEDIA.mobileMotion,
        },
        (context) => {
          const { desktopMotion } = readConditions(context);
          const section = queryOne(element, "[data-chaos-root]");
          const stage = queryOne(element, "[data-chaos-stage]");
          const title = queryOne(element, "[data-chaos-title]");
          const flow = queryOne(element, "[data-flow]");
          const line = queryOne(element, "[data-flow-line]");
          const order = queryOne(element, "[data-order]");
          if (!section || !stage || !title || !flow || !line || !order) return;

          const words = queryAll(element, "[data-chaos-word]");
          const orderHeading = queryAll(
            element,
            "[data-order-title], [data-order-subtitle]",
          );
          const steps = queryAll(element, "[data-flow-step]");
          const fill = queryAll(element, "[data-flow-fill]");

          const timeline = gsap.timeline({
            defaults: { ease: EASE.none },
            scrollTrigger: {
              trigger: desktopMotion ? section : stage,
              start: "top top",
              end: desktopMotion ? DESKTOP_PIN_DISTANCE : MOBILE_PIN_DISTANCE,
              pin: true,
              scrub: SCRUB_SMOOTHING_SECONDS,
              invalidateOnRefresh: true,
            },
          });

          timeline
            .fromTo(
              words,
              {
                autoAlpha: HIDDEN,
                scale: WORD_ENTRY_SCALE,
                xPercent: anchorPercent,
                rotation: (_index: number, target: HTMLElement) =>
                  readDegrees(target.dataset.rotate) *
                  WORD_ENTRY_ROTATION_FACTOR,
              },
              {
                autoAlpha: VISIBLE,
                scale: NATURAL_SCALE,
                xPercent: anchorPercent,
                rotation: (_index: number, target: HTMLElement) =>
                  readDegrees(target.dataset.rotate),
                duration: WORD_IN_DURATION,
                ease: EASE.out,
                stagger: {
                  amount: WORDS_TOTAL_DURATION,
                  ease: "power2.in",
                  from: "center",
                },
              },
            )
            .addLabel("pressure")
            .to(words, {
              scale: PRESSURE_SCALE,
              x: PRESSURE_SHAKE,
              y: PRESSURE_SHAKE,
              duration: PRESSURE_DURATION,
              ease: EASE.inOut,
            })
            .to(words, {
              x: PRESSURE_SHAKE_SMALL,
              y: PRESSURE_SHAKE_SMALL,
              duration: PRESSURE_DURATION,
              ease: EASE.inOut,
            })
            .addLabel("silence")
            .to(
              words,
              {
                x: (_index: number, target: Element) => {
                  const origin = center(stage);
                  return (center(target).x - origin.x) * SILENCE_SPREAD;
                },
                y: (_index: number, target: Element) => {
                  const origin = center(stage);
                  return (center(target).y - origin.y) * SILENCE_SPREAD;
                },
                scale: SILENCE_SCALE,
                autoAlpha: HIDDEN,
                duration: SILENCE_DURATION,
                ease: EASE.inOut,
                stagger: { amount: SILENCE_STAGGER, from: "random" },
              },
              "silence",
            )
            .addLabel("title", `silence+=${SILENCE_DURATION * HALF}`)
            .fromTo(
              title,
              { opacity: HIDDEN, scale: TITLE_ENTRY_SCALE },
              {
                opacity: VISIBLE,
                scale: NATURAL_SCALE,
                duration: TITLE_IN_DURATION,
                ease: EASE.out,
              },
              "title",
            )
            .to({}, { duration: TITLE_HOLD });

          if (!desktopMotion) {
            gsap.fromTo(
              orderHeading,
              { opacity: HIDDEN, y: ORDER_ENTRY_OFFSET },
              {
                opacity: VISIBLE,
                y: NO_OFFSET,
                duration: ORDER_IN_DURATION,
                stagger: STEP_STAGGER,
                ease: EASE.out,
                scrollTrigger: {
                  trigger: order,
                  start: MOBILE_REVEAL_START,
                  toggleActions: "play none none reverse",
                },
              },
            );

            gsap.fromTo(
              fill,
              { scaleY: HIDDEN },
              {
                scaleY: VISIBLE,
                ease: EASE.none,
                scrollTrigger: {
                  trigger: flow,
                  start: MOBILE_FLOW_START,
                  end: MOBILE_FLOW_END,
                  scrub: SCRUB_SMOOTHING_SECONDS,
                },
              },
            );
            return;
          }

          timeline
            .addLabel("order")
            .to(
              title,
              {
                opacity: HIDDEN,
                yPercent: TITLE_EXIT_OFFSET_PERCENT,
                rotation: NO_ROTATION,
                duration: TITLE_EXIT_DURATION,
              },
              "order",
            )
            .fromTo(
              orderHeading,
              { opacity: HIDDEN, y: ORDER_ENTRY_OFFSET },
              {
                opacity: VISIBLE,
                y: NO_OFFSET,
                duration: HEADING_IN_DURATION,
                stagger: HEADING_STAGGER,
                ease: EASE.out,
              },
              `order+=${TITLE_EXIT_DURATION * HALF}`,
            )
            .addLabel("flow", `>+=${FLOW_PAUSE}`)
            .fromTo(
              line,
              { autoAlpha: HIDDEN },
              { autoAlpha: VISIBLE, duration: ORDER_IN_DURATION },
              "flow",
            )
            .fromTo(
              fill,
              { scaleX: HIDDEN },
              { scaleX: VISIBLE, duration: STEP_INTERVAL * steps.length },
              "flow",
            )
            .fromTo(
              steps,
              { opacity: HIDDEN, y: ORDER_ENTRY_OFFSET * HALF },
              {
                opacity: VISIBLE,
                y: NO_OFFSET,
                duration: STEP_IN_DURATION,
                stagger: STEP_INTERVAL,
                ease: EASE.out,
              },
              "flow",
            )
            .to({}, { duration: HOLD_DURATION });
        },
      );
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
