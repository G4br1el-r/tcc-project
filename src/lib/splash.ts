export const SPLASH_ATTRIBUTE = "data-splash";
export const SPLASH_DONE_EVENT = "splash:done";

export const SPLASH_STATE = {
  active: "on",
  leaving: "leaving",
} as const;

const MINIMUM_VISIBLE_MS = 1800;
const MAXIMUM_WAIT_MS = 12000;
export const SPLASH_EXIT_MS = 1100;

export type SplashConfig = {
  attribute: string;
  activeState: string;
  leavingState: string;
  doneEvent: string;
  minimumMs: number;
  maximumMs: number;
  exitMs: number;
};

export const SPLASH_CONFIG: SplashConfig = {
  attribute: SPLASH_ATTRIBUTE,
  activeState: SPLASH_STATE.active,
  leavingState: SPLASH_STATE.leaving,
  doneEvent: SPLASH_DONE_EVENT,
  minimumMs: MINIMUM_VISIBLE_MS,
  maximumMs: MAXIMUM_WAIT_MS,
  exitMs: SPLASH_EXIT_MS,
};

export function bootSplash(config: SplashConfig): void {
  const root = document.documentElement;
  let leaving = false;

  const finish = () => {
    root.removeAttribute(config.attribute);
    window.dispatchEvent(new Event(config.doneEvent));
  };

  const leave = () => {
    if (leaving) return;
    leaving = true;
    root.setAttribute(config.attribute, config.leavingState);
    setTimeout(finish, config.exitMs);
  };

  const leaveAfterMinimum = () => {
    setTimeout(leave, config.minimumMs - performance.now());
  };

  root.setAttribute(config.attribute, config.activeState);
  setTimeout(leave, config.maximumMs - performance.now());

  if (document.readyState === "complete") leaveAfterMinimum();
  else window.addEventListener("load", leaveAfterMinimum, { once: true });
}

export function whenSplashDone(): Promise<void> {
  return new Promise((resolve) => {
    if (!document.documentElement.hasAttribute(SPLASH_ATTRIBUTE)) {
      resolve();
      return;
    }
    window.addEventListener(SPLASH_DONE_EVENT, () => resolve(), {
      once: true,
    });
  });
}
