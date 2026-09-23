"use client";

import { useEffect, useRef, useState } from "react";
import {
  createFaqAction,
  deleteFaqAction,
  updateFaqAction,
} from "@/app/admin/actions";
import { PROGRAMMATIC_FOCUS_ONLY } from "@/lib/a11y";
import { toHumanPosition } from "@/lib/faq-validation";
import { hasOrderChanged, mergeOrder } from "@/lib/reorder";
import { DeleteFaqButton } from "./DeleteFaqButton";
import { FaqForm } from "./FaqForm";
import { FaqOrderBar } from "./FaqOrderBar";
import { FaqSortableList } from "./FaqSortableList";
import type { AdminFaqItem } from "./faq-form-state";

const NO_ITEMS = 0;
const LIST_TITLE_ID = "faq-list-title";
const PANEL_TITLE_ID = "faq-panel-title";
const ORDER_KEY_SEPARATOR = "|";

type Selection =
  | { kind: "none" }
  | { kind: "new" }
  | { kind: "item"; id: string };

const NO_SELECTION: Selection = { kind: "none" };

function rowButtonId(id: string): string {
  return `faq-row-${id}`;
}

type FaqWorkspaceProps = {
  items: ReadonlyArray<AdminFaqItem>;
};

export function FaqWorkspace({ items }: FaqWorkspaceProps) {
  const savedOrder = items.map((item) => item.id);
  const savedKey = savedOrder.join(ORDER_KEY_SEPARATOR);
  const [syncedKey, setSyncedKey] = useState(savedKey);
  const [order, setOrder] = useState<string[]>(savedOrder);
  const [selection, setSelection] = useState<Selection>(NO_SELECTION);
  const pendingFocusId = useRef<string | null>(null);

  if (savedKey !== syncedKey) {
    setSyncedKey(savedKey);
    setOrder(mergeOrder(order, savedOrder));
  }

  const itemsById = new Map(items.map((item) => [item.id, item]));
  const orderedItems = order.flatMap((id) => {
    const item = itemsById.get(id);
    return item ? [item] : [];
  });
  const dirty = hasOrderChanged(savedOrder, order);
  const selectedItem =
    selection.kind === "item" ? itemsById.get(selection.id) : undefined;
  const activeSelection: Selection =
    selection.kind === "item" && !selectedItem ? NO_SELECTION : selection;

  useEffect(() => {
    const targetId = pendingFocusId.current;
    if (!targetId) return;
    pendingFocusId.current = null;
    document.getElementById(targetId)?.focus();
  });

  useEffect(() => {
    if (!dirty) return;
    function warnUnsavedOrder(event: BeforeUnloadEvent) {
      event.preventDefault();
    }
    window.addEventListener("beforeunload", warnUnsavedOrder);
    return () => window.removeEventListener("beforeunload", warnUnsavedOrder);
  }, [dirty]);

  function select(next: Selection) {
    pendingFocusId.current = PANEL_TITLE_ID;
    setSelection(next);
  }

  function backToList() {
    pendingFocusId.current =
      activeSelection.kind === "item"
        ? rowButtonId(activeSelection.id)
        : LIST_TITLE_ID;
    setSelection(NO_SELECTION);
  }

  const view = activeSelection.kind === "none" ? "list" : "panel";

  return (
    <div className="faq-workspace" data-view={view}>
      <section className="faq-workspace__list" aria-labelledby={LIST_TITLE_ID}>
        <div className="faq-workspace__bar">
          <h2
            id={LIST_TITLE_ID}
            className="faq-workspace__title"
            tabIndex={PROGRAMMATIC_FOCUS_ONLY}
          >
            Perguntas{" "}
            <span className="faq-workspace__count">{items.length}</span>
          </h2>
          <button
            type="button"
            className="admin__action"
            aria-current={activeSelection.kind === "new" || undefined}
            onClick={() => select({ kind: "new" })}
          >
            + Nova pergunta
          </button>
        </div>

        {items.length === NO_ITEMS ? (
          <p className="admin__text">Nenhuma pergunta cadastrada ainda.</p>
        ) : (
          <>
            <p className="faq-workspace__help">
              Arraste pela alça para reordenar. Clique numa pergunta para
              editar.
            </p>
            <FaqSortableList
              items={orderedItems}
              selectedId={
                activeSelection.kind === "item" ? activeSelection.id : null
              }
              onSelect={(id) => select({ kind: "item", id })}
              onReorder={setOrder}
              rowButtonId={rowButtonId}
            />
            <FaqOrderBar
              order={order}
              dirty={dirty}
              onDiscard={() => setOrder(savedOrder)}
            />
          </>
        )}
      </section>

      <section className="faq-panel" aria-labelledby={PANEL_TITLE_ID}>
        {activeSelection.kind === "none" ? (
          <div className="faq-panel__empty">
            <h2
              id={PANEL_TITLE_ID}
              className="faq-panel__title"
              tabIndex={PROGRAMMATIC_FOCUS_ONLY}
            >
              Nenhuma pergunta aberta
            </h2>
            <p className="admin__text">
              Selecione uma pergunta na lista ou crie uma nova.
            </p>
          </div>
        ) : (
          <>
            <button
              type="button"
              className="faq-panel__back"
              onClick={backToList}
            >
              ← Voltar para a lista
            </button>
            <div className="faq-panel__head">
              <div>
                {selectedItem ? (
                  <p className="faq-panel__eyebrow">
                    Posição {toHumanPosition(order.indexOf(selectedItem.id))} de{" "}
                    {order.length}
                  </p>
                ) : null}
                <h2
                  id={PANEL_TITLE_ID}
                  className="faq-panel__title"
                  tabIndex={PROGRAMMATIC_FOCUS_ONLY}
                >
                  {selectedItem ? "Editar pergunta" : "Nova pergunta"}
                </h2>
              </div>
              {selectedItem ? (
                <DeleteFaqButton
                  action={deleteFaqAction.bind(null, selectedItem.id)}
                  question={selectedItem.question}
                  itemLabel={selectedItem.question}
                  focusAfterDeleteId={LIST_TITLE_ID}
                />
              ) : null}
            </div>
            {selectedItem ? (
              <FaqForm
                key={selectedItem.id}
                action={updateFaqAction.bind(null, selectedItem.id)}
                defaults={{
                  question: selectedItem.question,
                  answer: selectedItem.answer,
                  published: selectedItem.published,
                }}
                submitLabel="Salvar alterações"
              />
            ) : (
              <FaqForm
                key="new"
                action={createFaqAction}
                submitLabel="Adicionar pergunta"
              />
            )}
          </>
        )}
      </section>
    </div>
  );
}
