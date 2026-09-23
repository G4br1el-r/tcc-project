"use client";

import { type ReactNode, useRef } from "react";
import { queryOne } from "@/lib/dom";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, MEDIA } from "@/lib/motion";

const SCROLL_END = "bottom top";
const MEDIA_PARALLAX_PERCENT = 18;
const CONTENT_EXIT_PERCENT = -12;
const CONTENT_EXIT_OPACITY = 0;

export function HeroMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const element = root.current;
      if (!element) return;
      const mm = gsap.matchMedia();

      mm.add(MEDIA.anyMotion, () => {
        const hero = queryOne(element, "[data-hero]");
        const media = queryOne(element, "[data-backdrop-media]");
        const content = queryOne(element, "[data-hero-content]");
        if (!hero || !media || !content) return;

        gsap
          .timeline({
            defaults: { ease: EASE.none },
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: SCROLL_END,
              scrub: true,
            },
          })
          .to(media, { yPercent: MEDIA_PARALLAX_PERCENT })
          .to(
            content,
            { yPercent: CONTENT_EXIT_PERCENT, autoAlpha: CONTENT_EXIT_OPACITY },
            "<",
          );
      });
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
