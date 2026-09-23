"use client";

import { type ReactNode, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MEDIA } from "@/lib/motion";
import { revealFades, revealLines } from "@/lib/reveal";

type ReviewsMotionProps = {
  children: ReactNode;
};

export function ReviewsMotion({ children }: ReviewsMotionProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const element = root.current;
      if (!element) return;
      const mm = gsap.matchMedia();

      mm.add(MEDIA.anyMotion, () => {
        revealLines(element);
        revealFades(element);
      });
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
