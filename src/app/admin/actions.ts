"use server";

import { refresh, updateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type {
  FaqFormState,
  FaqOrderState,
} from "@/components/admin/faq-form-state";
import { requireAdmin } from "@/lib/admin-session";
import { auth } from "@/lib/auth";
import {
  createFaq,
  deleteFaq,
  FAQ_CACHE_TAG,
  reorderFaq,
  updateFaq,
} from "@/lib/faq";
import {
  describeFaqErrors,
  type FaqInput,
  validateFaqForm,
} from "@/lib/faq-validation";
import { ADMIN_LOGIN_PATH } from "@/lib/routes";

function publishFaqChange(): void {
  updateTag(FAQ_CACHE_TAG);
  refresh();
}

function readSubmittedValues(form: FormData): FaqInput {
  const question = form.get("question");
  const answer = form.get("answer");
  return {
    question: typeof question === "string" ? question : "",
    answer: typeof answer === "string" ? answer : "",
    published: form.get("published") === "on",
  };
}

async function saveFaq(
  form: FormData,
  save: (input: FaqInput) => Promise<void>,
  successMessage: string,
): Promise<FaqFormState> {
  await requireAdmin();
  const result = validateFaqForm(form);
  if (!result.ok) {
    return {
      status: "error",
      message: describeFaqErrors(result.errors),
      errors: result.errors,
      values: readSubmittedValues(form),
    };
  }

  await save(result.value);
  publishFaqChange();
  return {
    status: "success",
    message: successMessage,
    errors: {},
    values: null,
  };
}

export async function createFaqAction(
  _previous: FaqFormState,
  form: FormData,
): Promise<FaqFormState> {
  return saveFaq(form, createFaq, "Pergunta adicionada.");
}

export async function updateFaqAction(
  id: string,
  _previous: FaqFormState,
  form: FormData,
): Promise<FaqFormState> {
  return saveFaq(form, (input) => updateFaq(id, input), "Alterações salvas.");
}

export async function deleteFaqAction(id: string): Promise<void> {
  await requireAdmin();
  await deleteFaq(id);
  publishFaqChange();
}

export async function saveFaqOrderAction(
  _previous: FaqOrderState,
  form: FormData,
): Promise<FaqOrderState> {
  await requireAdmin();
  const ids = form
    .getAll("order")
    .filter((value): value is string => typeof value === "string");

  const saved = await reorderFaq(ids);
  if (!saved) {
    return {
      status: "error",
      message:
        "A lista mudou em outra aba. Recarregue a página e tente de novo.",
    };
  }

  publishFaqChange();
  return { status: "success", message: "Ordem salva." };
}

export async function signOutAction(): Promise<void> {
  await auth.api.signOut({ headers: await headers() });
  redirect(ADMIN_LOGIN_PATH);
}
