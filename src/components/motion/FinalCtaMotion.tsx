"use client";

import { type ReactNode, useRef } from "react";
import { queryOne } from "@/lib/dom";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, MEDIA, NATURAL_SCALE } from "@/lib/motion";
import { revealAll } from "@/lib/reveal";

const MEDIA_START_SCALE = 1.2;
const SETTLE_START = "top bottom";
const SETTLE_END = "bottom bottom";

export function FinalCtaMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const element = root.current;
      if (!element) return;
      const mm = gsap.matchMedia();

      mm.add(MEDIA.anyMotion, () => {
        const section = queryOne(element, "[data-final]");
        const media = queryOne(element, "[data-backdrop-media]");
        if (!section || !media) return;

        revealAll(element);
        gsap.fromTo(
          media,
          { scale: MEDIA_START_SCALE },
          {
            scale: NATURAL_SCALE,
            ease: EASE.none,
            scrollTrigger: {
              trigger: section,
              start: SETTLE_START,
              end: SETTLE_END,
              scrub: true,
            },
          },
        );
      });
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
