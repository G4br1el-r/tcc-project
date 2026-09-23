import type { Metadata } from "next";
import { Suspense } from "react";
import { FaqManager } from "@/components/admin/FaqManager";
import { MAIN_CONTENT_ID } from "@/lib/a11y";

export const metadata: Metadata = { title: "Dúvidas frequentes" };

export default function AdminPage() {
  return (
    <main id={MAIN_CONTENT_ID} className="admin__main admin__main--wide">
      <Suspense fallback={<p className="admin__text">Carregando…</p>}>
        <FaqManager />
      </Suspense>
    </main>
  );
}
