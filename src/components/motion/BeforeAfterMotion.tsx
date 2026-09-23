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
  readConditions,
  SCRUB_SMOOTHING_SECONDS,
  VISIBLE,
} from "@/lib/motion";

const DESKTOP_PIN_DISTANCE = "+=150%";
const MOBILE_PIN_DISTANCE = "+=100%";
const FULL_OFFSET_PERCENT = 100;
const BEFORE_PUSH_SCALE = 1.08;
const WIPE_DURATION = 1;
const HOLD_DURATION = 0.3;
const TITLE_DURATION = 0.4;
const TITLE_OFFSET = 40;
const CAPTION_OFFSET = 24;
const CAPTION_DURATION = 0.45;

export function BeforeAfterMotion({ children }: { children: ReactNode }) {
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
          const stage = queryOne(element, "[data-ba-stage]");
          const title = queryOne(element, "[data-ba-title]");
          const after = queryOne(element, "[data-ba-after]");
          const inner = queryOne(element, "[data-ba-after-inner]");
          const beforeMedia = queryOne(element, "[data-ba-before-media]");
          const afterCaption = queryAll(
            element,
            "[data-ba-after-inner] .before-after__caption",
          );
          if (!stage || !title || !after || !inner || !beforeMedia) return;

          gsap
            .timeline({
              defaults: { ease: EASE.none },
              scrollTrigger: {
                trigger: stage,
                start: "top top",
                end: desktopMotion ? DESKTOP_PIN_DISTANCE : MOBILE_PIN_DISTANCE,
                pin: true,
                scrub: SCRUB_SMOOTHING_SECONDS,
                invalidateOnRefresh: true,
              },
            })
            .fromTo(
              title,
              { opacity: HIDDEN, y: TITLE_OFFSET },
              { opacity: VISIBLE, y: NO_OFFSET, duration: TITLE_DURATION },
            )
            .fromTo(
              after,
              { xPercent: FULL_OFFSET_PERCENT },
              { xPercent: NO_OFFSET, duration: WIPE_DURATION },
            )
            .fromTo(
              inner,
              { xPercent: -FULL_OFFSET_PERCENT },
              { xPercent: NO_OFFSET, duration: WIPE_DURATION },
              "<",
            )
            .fromTo(
              beforeMedia,
              { scale: NATURAL_SCALE },
              { scale: BEFORE_PUSH_SCALE, duration: WIPE_DURATION },
              "<",
            )
            .fromTo(
              afterCaption,
              { opacity: HIDDEN, y: CAPTION_OFFSET },
              { opacity: VISIBLE, y: NO_OFFSET, duration: CAPTION_DURATION },
              `<+=${WIPE_DURATION - CAPTION_DURATION}`,
            )
            .to({}, { duration: HOLD_DURATION });
        },
      );
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
