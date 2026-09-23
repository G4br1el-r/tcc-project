import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { requireEnv, resolveTrustedOrigins } from "./env";
import { siteUrl } from "./site";
import { ONE_HOUR_IN_SECONDS } from "./time";

export const auth = betterAuth({
  appName: "Painel JP Assessoria",
  baseURL: siteUrl.origin,
  secret: requireEnv(process.env, "BETTER_AUTH_SECRET"),
  trustedOrigins: resolveTrustedOrigins(process.env, siteUrl),
  database: drizzleAdapter(db, { provider: "sqlite", schema }),
  emailAndPassword: { enabled: true, disableSignUp: true },
  session: {
    cookieCache: { enabled: true, maxAge: ONE_HOUR_IN_SECONDS },
  },
  rateLimit: { enabled: true, storage: "database" },
  telemetry: { enabled: false },
  plugins: [username(), nextCookies()],
});
