import { describe, expect, it } from "vitest";
import {
  buildServiceMessage,
  buildWhatsAppUrl,
  isExternalWhatsAppHref,
  normalizeWhatsAppNumber,
  resolveWhatsAppHref,
  WHATSAPP_FALLBACK_HREF,
  WHATSAPP_MESSAGES,
} from "./whatsapp";

describe("normalizeWhatsAppNumber", () => {
  it("strips formatting characters", () => {
    expect(normalizeWhatsAppNumber("+55 (11) 98765-4321")).toBe(
      "5511987654321",
    );
  });

  it("rejects missing, too short and too long numbers", () => {
    expect(normalizeWhatsAppNumber(undefined)).toBeNull();
    expect(normalizeWhatsAppNumber("12345")).toBeNull();
    expect(normalizeWhatsAppNumber("1234567890123456")).toBeNull();
  });
});

describe("buildWhatsAppUrl", () => {
  it("encodes the message with percent-encoding", () => {
    expect(buildWhatsAppUrl("5511987654321", "Olá! Tudo bem?\nCurso:")).toBe(
      "https://wa.me/5511987654321?text=Ol%C3%A1!%20Tudo%20bem%3F%0ACurso%3A",
    );
  });
});

describe("resolveWhatsAppHref", () => {
  it("returns a wa.me link when the number is valid", () => {
    const href = resolveWhatsAppHref("Oi", "11 98765-4321");
    expect(href).toBe("https://wa.me/11987654321?text=Oi");
    expect(isExternalWhatsAppHref(href)).toBe(true);
  });

  it("returns the on-page fallback when the number is missing", () => {
    const href = resolveWhatsAppHref("Oi", "");
    expect(href).toBe(WHATSAPP_FALLBACK_HREF);
    expect(isExternalWhatsAppHref(href)).toBe(false);
  });
});

describe("messages", () => {
  it("names the service in contextual messages", () => {
    expect(buildServiceMessage("Normalização ABNT")).toContain(
      '"Normalização ABNT"',
    );
  });

  it("asks qualifying questions in the hero message", () => {
    expect(WHATSAPP_MESSAGES.hero.split("\n")).toEqual([
      "Olá! Quero ajuda com meu trabalho acadêmico.",
      "Curso:",
      "Tipo de trabalho:",
      "Prazo:",
    ]);
  });
});
