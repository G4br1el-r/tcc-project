"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

export function MotionRuntime() {
  useEffect(() => {
    let active = true;
    document.fonts.ready.then(() => {
      if (active) ScrollTrigger.refresh();
    });
    return () => {
      active = false;
    };
  }, []);

  return null;
}
