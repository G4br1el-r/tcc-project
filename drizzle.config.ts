import { defineConfig } from "drizzle-kit";
import { loadLocalEnv } from "./scripts/load-local-env";
import { readToken, requireEnv } from "./src/lib/env";

loadLocalEnv();

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url: requireEnv(process.env, "TURSO_DATABASE_URL"),
    authToken: readToken(process.env.TURSO_AUTH_TOKEN),
  },
});
