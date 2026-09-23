import { existsSync } from "node:fs";

const LOCAL_ENV_FILE = ".env.local";

export function loadLocalEnv(): void {
  if (existsSync(LOCAL_ENV_FILE)) process.loadEnvFile(LOCAL_ENV_FILE);
}
