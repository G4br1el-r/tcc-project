import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  bootSplash,
  SPLASH_ATTRIBUTE,
  SPLASH_CONFIG,
  SPLASH_DONE_EVENT,
  SPLASH_STATE,
  whenSplashDone,
} from "./splash";

const ONE_MILLISECOND = 1;
const IMMEDIATELY = 0;

type FakeRoot = {
  setAttribute: (name: string, value: string) => void;
  getAttribute: (name: string) => string | null;
  hasAttribute: (name: string) => boolean;
  removeAttribute: (name: string) => void;
};

type FakeDocument = {
  readyState: DocumentReadyState;
  documentElement: FakeRoot;
};

function createRoot(): FakeRoot {
  const attributes = new Map<string, string>();
  return {
    setAttribute: (name, value) => {
      attributes.set(name, value);
    },
    getAttribute: (name) => attributes.get(name) ?? null,
    hasAttribute: (name) => attributes.has(name),
    removeAttribute: (name) => {
      attributes.delete(name);
    },
  };
}

let fakeWindow: EventTarget;
let fakeDocument: FakeDocument;

function splashState(): string | null {
  return fakeDocument.documentElement.getAttribute(SPLASH_ATTRIBUTE);
}

function firePageLoad(): void {
  fakeDocument.readyState = "complete";
  fakeWindow.dispatchEvent(new Event("load"));
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "performance"] });
  fakeWindow = new EventTarget();
  fakeDocument = { readyState: "loading", documentElement: createRoot() };
  vi.stubGlobal("window", fakeWindow);
  vi.stubGlobal("document", fakeDocument);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("bootSplash", () => {
  it("covers the page immediately", () => {
    bootSplash(SPLASH_CONFIG);
    expect(splashState()).toBe(SPLASH_STATE.active);
  });

  it("holds while the page is still loading", () => {
    bootSplash(SPLASH_CONFIG);
    vi.advanceTimersByTime(SPLASH_CONFIG.maximumMs - ONE_MILLISECOND);
    expect(splashState()).toBe(SPLASH_STATE.active);
  });

  it("leaves right after load once the minimum time has passed", () => {
    bootSplash(SPLASH_CONFIG);
    vi.advanceTimersByTime(SPLASH_CONFIG.minimumMs);
    firePageLoad();
    vi.advanceTimersByTime(IMMEDIATELY);
    expect(splashState()).toBe(SPLASH_STATE.leaving);
  });

  it("waits for the remaining minimum time when load is early", () => {
    bootSplash(SPLASH_CONFIG);
    firePageLoad();
    vi.advanceTimersByTime(SPLASH_CONFIG.minimumMs - ONE_MILLISECOND);
    expect(splashState()).toBe(SPLASH_STATE.active);
    vi.advanceTimersByTime(ONE_MILLISECOND);
    expect(splashState()).toBe(SPLASH_STATE.leaving);
  });

  it("handles a document that is already complete", () => {
    fakeDocument.readyState = "complete";
    bootSplash(SPLASH_CONFIG);
    vi.advanceTimersByTime(SPLASH_CONFIG.minimumMs);
    expect(splashState()).toBe(SPLASH_STATE.leaving);
  });

  it("clears the flag and announces completion after the exit", () => {
    const onDone = vi.fn();
    fakeWindow.addEventListener(SPLASH_DONE_EVENT, onDone);
    bootSplash(SPLASH_CONFIG);
    firePageLoad();
    vi.advanceTimersByTime(SPLASH_CONFIG.minimumMs);
    vi.advanceTimersByTime(SPLASH_CONFIG.exitMs - ONE_MILLISECOND);
    expect(onDone).not.toHaveBeenCalled();
    vi.advanceTimersByTime(ONE_MILLISECOND);
    expect(splashState()).toBeNull();
    expect(onDone).toHaveBeenCalledOnce();
  });

  it("releases the page after the maximum wait even without load", () => {
    bootSplash(SPLASH_CONFIG);
    vi.advanceTimersByTime(SPLASH_CONFIG.maximumMs);
    expect(splashState()).toBe(SPLASH_STATE.leaving);
  });

  it("runs the exit only once when load and the safety timeout both fire", () => {
    const onDone = vi.fn();
    fakeWindow.addEventListener(SPLASH_DONE_EVENT, onDone);
    bootSplash(SPLASH_CONFIG);
    vi.advanceTimersByTime(SPLASH_CONFIG.minimumMs);
    firePageLoad();
    vi.runAllTimers();
    expect(onDone).toHaveBeenCalledOnce();
  });

  it("stays self-contained so it can be inlined as a script", () => {
    const script = `(${bootSplash.toString()})(${JSON.stringify(SPLASH_CONFIG)})`;
    new Function(script)();
    expect(splashState()).toBe(SPLASH_STATE.active);
  });
});

describe("whenSplashDone", () => {
  it("resolves at once when there is no splash", async () => {
    await expect(whenSplashDone()).resolves.toBeUndefined();
  });

  it("resolves when the splash announces completion", async () => {
    const onResolve = vi.fn();
    bootSplash(SPLASH_CONFIG);
    const done = whenSplashDone().then(onResolve);
    await vi.advanceTimersByTimeAsync(IMMEDIATELY);
    expect(onResolve).not.toHaveBeenCalled();
    firePageLoad();
    await vi.advanceTimersByTimeAsync(
      SPLASH_CONFIG.minimumMs + SPLASH_CONFIG.exitMs,
    );
    await done;
    expect(onResolve).toHaveBeenCalledOnce();
  });
});
