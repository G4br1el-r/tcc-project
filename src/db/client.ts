import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { type EnvSource, readToken, requireEnv } from "@/lib/env";
import * as schema from "./schema";

export function createDatabase(env: EnvSource) {
  const client = createClient({
    url: requireEnv(env, "TURSO_DATABASE_URL"),
    authToken: readToken(env.TURSO_AUTH_TOKEN),
  });
  return drizzle({ client, schema });
}

export type Database = ReturnType<typeof createDatabase>;
