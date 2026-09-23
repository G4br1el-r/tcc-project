"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const confirmed = useRef(false);

  function handleOpenChange(next: boolean) {
    if (pending) return;
    if (next) confirmed.current = false;
    setOpen(next);
  }

  function handleCloseAutoFocus(event: Event) {
    if (!confirmed.current) return;
    event.preventDefault();
    document.getElementById(focusAfterDeleteId)?.focus();
  }

  function confirmDelete() {
    confirmed.current = true;
    startTransition(async () => {
      try {
        await action();
        toast.success("Pergunta excluída.");
      } catch {
        toast.error("Não foi possível excluir. Tente de novo.");
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className="admin__action admin__action--danger"
          aria-disabled={pending || undefined}
        >
          Excluir
          <span className="sr-only"> {itemLabel}</span>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent onCloseAutoFocus={handleCloseAutoFocus}>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir pergunta?</AlertDialogTitle>
          <AlertDialogDescription>
            &ldquo;{question}&rdquo; será removida do FAQ do site. Essa ação não
            pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={confirmDelete}>
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
