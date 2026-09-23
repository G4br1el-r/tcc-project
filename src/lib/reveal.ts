"use client";

import { queryAll } from "./dom";
import { gsap, SplitText } from "./gsap";
import { EASE, HIDDEN, NO_OFFSET, VISIBLE } from "./motion";

const LINE_ENTRY_PERCENT = 110;
const LINE_DURATION = 1.1;
const LINE_STAGGER = 0.09;
const FADE_DURATION = 1;
const FADE_OFFSET = 28;
const FADE_STAGGER = 0.12;
const REVEAL_START = "top 85%";
const TOGGLE_ACTIONS = "play none none reverse";
const COMPLETE = 1;
const MASK_BLEED_EM = "0.14em";

export function completeOnFocus(
  group: Element,
  animation: gsap.core.Animation,
): void {
  const finish = () => {
    animation.progress(COMPLETE);
  };
  group.addEventListener("focusin", finish);
  animation.eventCallback("onComplete", () => {
    group.removeEventListener("focusin", finish);
  });
}

export function revealLines(scope: ParentNode): void {
  for (const element of queryAll(scope, "[data-reveal-lines]")) {
    SplitText.create(element, {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      onSplit: (self) => {
        gsap.set(self.masks, {
          paddingBlock: MASK_BLEED_EM,
          marginBlock: `-${MASK_BLEED_EM}`,
          paddingInline: MASK_BLEED_EM,
          marginInline: `-${MASK_BLEED_EM}`,
        });
        return gsap.from(self.lines, {
          yPercent: LINE_ENTRY_PERCENT,
          duration: LINE_DURATION,
          stagger: LINE_STAGGER,
          ease: EASE.out,
          scrollTrigger: {
            trigger: element,
            start: REVEAL_START,
            toggleActions: TOGGLE_ACTIONS,
          },
        });
      },
    });
  }
}

export function revealFades(scope: ParentNode): void {
  const groups = new Map<Element, HTMLElement[]>();
  for (const element of queryAll(scope, "[data-reveal-fade]")) {
    const group = element.closest("[data-reveal-group]") ?? element;
    const list = groups.get(group) ?? [];
    list.push(element);
    groups.set(group, list);
  }
  for (const [group, elements] of groups) {
    const tween = gsap.fromTo(
      elements,
      { opacity: HIDDEN, y: FADE_OFFSET },
      {
        opacity: VISIBLE,
        y: NO_OFFSET,
        duration: FADE_DURATION,
        stagger: FADE_STAGGER,
        ease: EASE.out,
        scrollTrigger: {
          trigger: group,
          start: REVEAL_START,
          toggleActions: TOGGLE_ACTIONS,
        },
      },
    );
    completeOnFocus(group, tween);
  }
}

export function revealAll(scope: ParentNode): void {
  revealLines(scope);
  revealFades(scope);
}
