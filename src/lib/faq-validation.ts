export const FAQ_QUESTION_MAX_LENGTH = 200;
export const FAQ_ANSWER_MAX_LENGTH = 1500;
const FAQ_ID_MAX_LENGTH = 60;
const FIRST_DUPLICATE_SUFFIX = 2;
const DUPLICATE_SUFFIX_STEP = 1;
const FALLBACK_FAQ_ID = "pergunta";
const HUMAN_POSITION_OFFSET = 1;

export type FaqInput = {
  question: string;
  answer: string;
  published: boolean;
};

const FAQ_FIELDS = ["question", "answer"] as const;
type FaqField = (typeof FAQ_FIELDS)[number];

const FAQ_FIELD_NAMES: Record<FaqField, string> = {
  question: "a pergunta",
  answer: "a resposta",
};

export type FaqFieldErrors = Partial<Record<FaqField, string>>;

export function describeFaqErrors(errors: FaqFieldErrors): string {
  const fields = FAQ_FIELDS.filter((field) => errors[field]).map(
    (field) => FAQ_FIELD_NAMES[field],
  );
  return `Revise ${fields.join(" e ")}.`;
}

export function toHumanPosition(index: number): number {
  return index + HUMAN_POSITION_OFFSET;
}

export function describeFaqPosition(position: number, total: number): string {
  return `Posição ${toHumanPosition(position)} de ${total}.`;
}

export function describeFaqPlacement(position: number, total: number): string {
  return `Pergunta movida para a posição ${toHumanPosition(position)} de ${total}.`;
}

export type FaqValidation =
  | { ok: true; value: FaqInput }
  | { ok: false; errors: FaqFieldErrors };

function readText(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function checkText(
  value: string,
  maxLength: number,
  label: string,
): string | undefined {
  if (!value) return `Preencha ${label}.`;
  if (value.length > maxLength) {
    return `Use no máximo ${maxLength} caracteres em ${label}.`;
  }
  return undefined;
}

export function validateFaqForm(form: FormData): FaqValidation {
  const question = readText(form.get("question"));
  const answer = readText(form.get("answer"));
  const published = form.get("published") === "on";

  const errors: FaqFieldErrors = {};
  const questionError = checkText(
    question,
    FAQ_QUESTION_MAX_LENGTH,
    "a pergunta",
  );
  const answerError = checkText(answer, FAQ_ANSWER_MAX_LENGTH, "a resposta");
  if (questionError) errors.question = questionError;
  if (answerError) errors.answer = answerError;

  if (questionError || answerError) return { ok: false, errors };
  return { ok: true, value: { question, answer, published } };
}

export function slugifyFaqId(question: string): string {
  const slug = question
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, FAQ_ID_MAX_LENGTH)
    .replace(/^-+|-+$/g, "");
  return slug || FALLBACK_FAQ_ID;
}

export function createUniqueFaqId(
  question: string,
  existingIds: ReadonlySet<string>,
): string {
  const base = slugifyFaqId(question);
  if (!existingIds.has(base)) return base;

  let suffix = FIRST_DUPLICATE_SUFFIX;
  while (existingIds.has(`${base}-${suffix}`)) suffix += DUPLICATE_SUFFIX_STEP;
  return `${base}-${suffix}`;
}
