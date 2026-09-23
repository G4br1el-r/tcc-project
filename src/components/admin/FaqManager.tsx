import { signOutAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin-session";
import { listAllFaq } from "@/lib/faq";
import { FaqWorkspace } from "./FaqWorkspace";

export async function FaqManager() {
  const session = await requireAdmin();
  const items = await listAllFaq();

  return (
    <>
      <header className="admin__header">
        <div>
          <p className="admin__eyebrow">Painel</p>
          <h1 className="admin__title">Dúvidas frequentes</h1>
          <p className="admin__text">
            Conectado como{" "}
            {session.user.displayUsername ?? session.user.username}. As
            alterações aparecem na landing assim que são salvas.
          </p>
        </div>
        <form action={signOutAction}>
          <button type="submit" className="admin__action">
            Sair
          </button>
        </form>
      </header>

      <FaqWorkspace
        items={items.map(({ id, question, answer, published }) => ({
          id,
          question,
          answer,
          published,
        }))}
      />
    </>
  );
}
