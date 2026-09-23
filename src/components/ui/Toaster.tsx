"use client";

import type { CSSProperties } from "react";
import { Toaster as Sonner } from "sonner";

const TOASTER_STYLE = {
  "--normal-bg": "var(--surface-raised)",
  "--normal-text": "var(--white)",
  "--normal-border": "var(--line)",
  "--border-radius": "0.75rem",
  fontFamily: "inherit",
} as CSSProperties;

export function Toaster() {
  return (
    <Sonner
      theme="dark"
      position="top-right"
      closeButton
      containerAriaLabel="Notificações"
      className="toaster"
      style={TOASTER_STYLE}
    />
  );
}
