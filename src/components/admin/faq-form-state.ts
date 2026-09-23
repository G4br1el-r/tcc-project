import type { FaqFieldErrors, FaqInput } from "@/lib/faq-validation";

export type FaqFormState = {
  status: "idle" | "success" | "error";
  message: string | null;
  errors: FaqFieldErrors;
  values: FaqInput | null;
};

export const INITIAL_FAQ_FORM_STATE: FaqFormState = {
  status: "idle",
  message: null,
  errors: {},
  values: null,
};

export type FaqOrderState = {
  status: "idle" | "success" | "error";
  message: string | null;
};

export const INITIAL_FAQ_ORDER_STATE: FaqOrderState = {
  status: "idle",
  message: null,
};

export type AdminFaqItem = {
  id: string;
  question: string;
  answer: string;
  published: boolean;
};
