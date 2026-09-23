"use client";

import { type FormEvent, useActionState } from "react";
import { saveFaqOrderAction } from "@/app/admin/actions";
import { INITIAL_FAQ_ORDER_STATE } from "./faq-form-state";
import { useStatusToast } from "./use-status-toast";

type FaqOrderBarProps = {
  order: ReadonlyArray<string>;
  dirty: boolean;
  onDiscard: () => void;
};

export function FaqOrderBar({ order, dirty, onDiscard }: FaqOrderBarProps) {
  const [state, formAction, pending] = useActionState(
    saveFaqOrderAction,
    INITIAL_FAQ_ORDER_STATE,
  );
  useStatusToast(state);

  function guardSubmit(event: FormEvent<HTMLFormElement>) {
    if (pending) event.preventDefault();
  }

  function describeStatus(): string | null {
    if (pending) return "Salvando ordem…";
    return dirty ? "Ordem alterada, ainda não salva." : null;
  }

  return (
    <div className="faq-order" data-dirty={dirty}>
      <output className="faq-order__status">{describeStatus()}</output>
      {dirty ? (
        <form
          action={formAction}
          onSubmit={guardSubmit}
          className="faq-order__actions"
        >
          {order.map((id) => (
            <input key={id} type="hidden" name="order" value={id} />
          ))}
          <button
            type="button"
            className="admin__action"
            aria-disabled={pending || undefined}
            onClick={() => {
              if (!pending) onDiscard();
            }}
          >
            Descartar
          </button>
          <button
            type="submit"
            className="btn btn--compact"
            aria-disabled={pending || undefined}
          >
            Salvar ordem
          </button>
        </form>
      ) : null}
    </div>
  );
}
