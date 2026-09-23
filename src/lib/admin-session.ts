import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { ADMIN_LOGIN_PATH } from "./routes";

export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(ADMIN_LOGIN_PATH);
  return session;
}
