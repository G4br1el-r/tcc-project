"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

type StatusState = {
  status: "idle" | "success" | "error";
  message: string | null;
};

export function useStatusToast(state: StatusState): void {
  const announced = useRef<StatusState | null>(null);

  useEffect(() => {
    if (announced.current === state) return;
    announced.current = state;
    if (!state.message) return;
    if (state.status === "success") toast.success(state.message);
    if (state.status === "error") toast.error(state.message);
  }, [state]);
}
