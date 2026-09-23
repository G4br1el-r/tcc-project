"use client";

import type { FormEvent } from "react";
import { toast } from "sonner";

type DeleteFaqButtonProps = {
  action: () => Promise<void>;
  question: string;
  itemLabel: string;
  focusAfterDeleteId: string;
};

export function DeleteFaqButton({
  action,
  question,
  itemLabel,
  focusAfterDeleteId,
}: DeleteFaqButtonProps) {
  function confirmDelete(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm(`Excluir a pergunta "${question}"?`)) {
      event.preventDefault();
      return;
    }
    document.getElementById(focusAfterDeleteId)?.focus();
  }

  async function deleteAndNotify() {
    try {
      await action();
      toast.success("Pergunta excluída.");
    } catch {
      toast.error("Não foi possível excluir. Tente de novo.");
    }
  }

  return (
    <form action={deleteAndNotify} onSubmit={confirmDelete}>
      <button type="submit" className="admin__action admin__action--danger">
        Excluir
        <span className="sr-only"> {itemLabel}</span>
      </button>
    </form>
  );
}
