"use client";

import { type FormEvent, useActionState, useId } from "react";
import {
  FAQ_ANSWER_MAX_LENGTH,
  FAQ_QUESTION_MAX_LENGTH,
  type FaqInput,
} from "@/lib/faq-validation";
import { type FaqFormState, INITIAL_FAQ_FORM_STATE } from "./faq-form-state";
import { useStatusToast } from "./use-status-toast";

const ANSWER_ROWS = 4;

type FaqFormProps = {
  action: (state: FaqFormState, form: FormData) => Promise<FaqFormState>;
  defaults?: FaqInput;
  submitLabel: string;
  itemLabel?: string;
};

export function FaqForm({
  action,
  defaults,
  submitLabel,
  itemLabel,
}: FaqFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    INITIAL_FAQ_FORM_STATE,
  );
  const id = useId();
  useStatusToast(state);
  const values = state.values ?? defaults;
  const questionErrorId = `${id}-question-error`;
  const answerErrorId = `${id}-answer-error`;

  function guardSubmit(event: FormEvent<HTMLFormElement>) {
    if (pending) event.preventDefault();
  }

  return (
    <form action={formAction} onSubmit={guardSubmit} className="admin-form">
      <div className="admin-form__field">
        <label htmlFor={`${id}-question`}>Pergunta</label>
        <input
          id={`${id}-question`}
          name="question"
          defaultValue={values?.question}
          maxLength={FAQ_QUESTION_MAX_LENGTH}
          required
          aria-invalid={state.errors.question ? true : undefined}
          aria-describedby={state.errors.question ? questionErrorId : undefined}
        />
        {state.errors.question ? (
          <p id={questionErrorId} className="admin-form__error">
            {state.errors.question}
          </p>
        ) : null}
      </div>

      <div className="admin-form__field">
        <label htmlFor={`${id}-answer`}>Resposta</label>
        <textarea
          id={`${id}-answer`}
          name="answer"
          rows={ANSWER_ROWS}
          defaultValue={values?.answer}
          maxLength={FAQ_ANSWER_MAX_LENGTH}
          required
          aria-invalid={state.errors.answer ? true : undefined}
          aria-describedby={state.errors.answer ? answerErrorId : undefined}
        />
        {state.errors.answer ? (
          <p id={answerErrorId} className="admin-form__error">
            {state.errors.answer}
          </p>
        ) : null}
      </div>

      <label className="admin-form__check">
        <input
          type="checkbox"
          name="published"
          defaultChecked={values?.published ?? true}
        />
        Publicada na landing
      </label>

      <div className="admin-form__footer">
        <button
          type="submit"
          className="btn btn--compact"
          aria-disabled={pending || undefined}
        >
          {submitLabel}
          {itemLabel ? <span className="sr-only"> {itemLabel}</span> : null}
        </button>
        <output className="admin-form__status">
          {pending ? "Salvando…" : null}
        </output>
      </div>
    </form>
  );
}
