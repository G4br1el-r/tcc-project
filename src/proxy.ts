import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ADMIN_LOGIN_PATH, ADMIN_PATH, resolveAdminAccess } from "@/lib/routes";

export async function proxy(request: NextRequest) {
  const access = resolveAdminAccess(
    request.nextUrl.pathname,
    getSessionCookie(request) !== null,
  );

  if (access === "redirect-to-login") {
    return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
  }

  if (access === "verify-session") {
    const session = await auth.api.getSession({ headers: request.headers });
    if (session) return NextResponse.redirect(new URL(ADMIN_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
