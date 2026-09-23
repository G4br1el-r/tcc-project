const DESKTOP_MIN_WIDTH = "56.25rem";
const MOBILE_MAX_WIDTH = "56.249rem";
const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export const MEDIA = {
  desktopMotion: `(min-width: ${DESKTOP_MIN_WIDTH}) and ${MOTION_OK}`,
  mobileMotion: `(max-width: ${MOBILE_MAX_WIDTH}) and ${MOTION_OK}`,
  anyMotion: MOTION_OK,
} as const;

export type MotionConditions = {
  desktopMotion?: boolean;
  mobileMotion?: boolean;
  anyMotion?: boolean;
};

export const EASE = {
  out: "power3.out",
  inOut: "power2.inOut",
  none: "none",
} as const;

export const VISIBLE = 1;
export const HIDDEN = 0;
export const NATURAL_SCALE = 1;
export const NO_OFFSET = 0;
export const NO_ROTATION = 0;

export const SCRUB_SMOOTHING_SECONDS = 0.2;

export const MOTION_ATTRIBUTE = "motion";
export const MOTION_ON = "on";

export function readConditions(context: {
  conditions?: Record<string, boolean>;
}): MotionConditions {
  return context.conditions ?? {};
}

export function readDegrees(value: string | undefined): number {
  const parsed = Number.parseFloat(value ?? "");
  return Number.isFinite(parsed) ? parsed : NO_ROTATION;
}
