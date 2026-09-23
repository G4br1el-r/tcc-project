"use client";

import { type ReactNode, useRef } from "react";
import { queryAll } from "@/lib/dom";
import { formatCount } from "@/lib/format";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, MEDIA } from "@/lib/motion";
import { revealFades } from "@/lib/reveal";

const COUNT_DURATION = 1.8;
const COUNT_START = 0;
const COUNT_TRIGGER = "top 80%";
const COUNT_STAGGER = 0.15;
const SNAP_STEP = 1;

export function StatsMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const element = root.current;
      if (!element) return;
      const mm = gsap.matchMedia();

      mm.add(MEDIA.anyMotion, () => {
        revealFades(element);
        const counters = queryAll(element, "[data-count]");

        counters.forEach((counter, index) => {
          const target = Number(counter.dataset.count);
          if (!Number.isFinite(target)) return;
          const state = { value: COUNT_START };
          gsap.fromTo(
            state,
            { value: COUNT_START },
            {
              value: target,
              immediateRender: true,
              duration: COUNT_DURATION,
              delay: index * COUNT_STAGGER,
              ease: EASE.out,
              snap: { value: SNAP_STEP },
              onUpdate: () => {
                counter.textContent = formatCount(state.value);
              },
              scrollTrigger: {
                trigger: element,
                start: COUNT_TRIGGER,
                once: true,
              },
            },
          );
        });
      });
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
