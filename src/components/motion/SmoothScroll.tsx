"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MEDIA } from "@/lib/motion";
import { whenSplashDone } from "@/lib/splash";

const MILLISECONDS_PER_SECOND = 1000;
const NO_LAG_SMOOTHING = 0;

export function SmoothScroll() {
  useEffect(() => {
    if (!window.matchMedia(MEDIA.desktopMotion).matches) return;

    let cleanup: (() => void) | null = null;
    let cancelled = false;

    Promise.all([import("lenis"), whenSplashDone()]).then(
      ([{ default: Lenis }]) => {
        if (cancelled) return;
        const lenis = new Lenis({
          autoRaf: false,
          anchors: true,
        });
        const update = (time: number) => {
          lenis.raf(time * MILLISECONDS_PER_SECOND);
        };
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(update);
        gsap.ticker.lagSmoothing(NO_LAG_SMOOTHING);
        cleanup = () => {
          gsap.ticker.remove(update);
          lenis.destroy();
        };
      },
    );

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return null;
}
