import { describe, expect, it } from "vitest";
import {
  createUniqueFaqId,
  describeFaqErrors,
  describeFaqPlacement,
  describeFaqPosition,
  FAQ_ANSWER_MAX_LENGTH,
  FAQ_QUESTION_MAX_LENGTH,
  slugifyFaqId,
  validateFaqForm,
} from "./faq-validation";

const EXTRA_CHARACTER = 1;

function buildForm(fields: Record<string, string>): FormData {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.set(key, value);
  return form;
}

describe("validateFaqForm", () => {
  it("trims values and reads the published checkbox", () => {
    const result = validateFaqForm(
      buildForm({
        question: "  Quanto custa?  ",
        answer: " Depende do prazo. ",
        published: "on",
      }),
    );
    expect(result).toEqual({
      ok: true,
      value: {
        question: "Quanto custa?",
        answer: "Depende do prazo.",
        published: true,
      },
    });
  });

  it("treats a missing checkbox as unpublished", () => {
    const result = validateFaqForm(
      buildForm({ question: "Pergunta", answer: "Resposta" }),
    );
    expect(result.ok && result.value.published).toBe(false);
  });

  it("rejects empty and whitespace-only fields", () => {
    const result = validateFaqForm(buildForm({ question: "   " }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.question).toBeDefined();
    expect(result.errors.answer).toBeDefined();
  });

  it("rejects values above the length limits", () => {
    const result = validateFaqForm(
      buildForm({
        question: "a".repeat(FAQ_QUESTION_MAX_LENGTH + EXTRA_CHARACTER),
        answer: "b".repeat(FAQ_ANSWER_MAX_LENGTH + EXTRA_CHARACTER),
      }),
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.question).toMatch(String(FAQ_QUESTION_MAX_LENGTH));
    expect(result.errors.answer).toMatch(String(FAQ_ANSWER_MAX_LENGTH));
  });

  it("accepts values exactly at the limits", () => {
    const result = validateFaqForm(
      buildForm({
        question: "a".repeat(FAQ_QUESTION_MAX_LENGTH),
        answer: "b".repeat(FAQ_ANSWER_MAX_LENGTH),
      }),
    );
    expect(result.ok).toBe(true);
  });
});

describe("describeFaqErrors", () => {
  it("names only the invalid fields", () => {
    expect(describeFaqErrors({ answer: "x" })).toBe("Revise a resposta.");
    expect(describeFaqErrors({ question: "x", answer: "y" })).toBe(
      "Revise a pergunta e a resposta.",
    );
  });
});

describe("describeFaqPlacement", () => {
  it("uses one-based positions", () => {
    expect(describeFaqPlacement(0, 9)).toBe(
      "Pergunta movida para a posição 1 de 9.",
    );
  });
});

describe("describeFaqPosition", () => {
  it("uses one-based positions", () => {
    expect(describeFaqPosition(2, 5)).toBe("Posição 3 de 5.");
  });
});

describe("slugifyFaqId", () => {
  it("removes accents and punctuation", () => {
    expect(slugifyFaqId("Quais são as formas de pagamento?")).toBe(
      "quais-sao-as-formas-de-pagamento",
    );
  });

  it("falls back when nothing usable remains", () => {
    expect(slugifyFaqId("???")).toBe("pergunta");
  });
});

describe("createUniqueFaqId", () => {
  it("keeps the slug when it is free", () => {
    expect(createUniqueFaqId("Prazo curto", new Set())).toBe("prazo-curto");
  });

  it("appends the next free suffix", () => {
    const taken = new Set(["prazo-curto", "prazo-curto-2"]);
    expect(createUniqueFaqId("Prazo curto", taken)).toBe("prazo-curto-3");
  });
});
