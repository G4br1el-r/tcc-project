export type EnvSource = Readonly<Record<string, string | undefined>>;

const LOCAL_SITE_URL = "http://localhost:3000";
const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

export function parseHttpOrigin(value: string | undefined): URL | null {
  const candidate = value?.trim();
  if (!candidate) return null;

  try {
    const parsed = new URL(candidate);
    if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) return null;
    return new URL(parsed.origin);
  } catch {
    return null;
  }
}

export function resolveSiteUrl(env: EnvSource): URL {
  const vercelProductionHost = env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const candidates = [
    env.NEXT_PUBLIC_SITE_URL,
    vercelProductionHost ? `https://${vercelProductionHost}` : undefined,
  ];

  for (const candidate of candidates) {
    const origin = parseHttpOrigin(candidate);
    if (origin) return origin;
  }

  return new URL(LOCAL_SITE_URL);
}

export function resolveIndexable(env: EnvSource): boolean {
  if (env.VERCEL_ENV) return env.VERCEL_ENV === "production";
  return (
    env.NODE_ENV === "production" &&
    parseHttpOrigin(env.NEXT_PUBLIC_SITE_URL) !== null
  );
}

export function readToken(value: string | undefined): string | undefined {
  const token = value?.trim();
  return token ? token : undefined;
}

export function requireEnv(env: EnvSource, name: string): string {
  const value = readToken(env[name]);
  if (!value)
    throw new Error(`Variável de ambiente obrigatória ausente: ${name}`);
  return value;
}

export function resolveTrustedOrigins(env: EnvSource, siteUrl: URL): string[] {
  const deploymentHosts = [env.VERCEL_URL, env.VERCEL_BRANCH_URL]
    .map(readToken)
    .filter((host) => host !== undefined)
    .map((host) => `https://${host}`);

  const localHosts = env.NODE_ENV === "development" ? [LOCAL_SITE_URL] : [];

  const origins = [siteUrl.href, ...deploymentHosts, ...localHosts]
    .map(parseHttpOrigin)
    .filter((origin) => origin !== null)
    .map((origin) => origin.origin);

  return [...new Set(origins)];
}

export const runtimeEnv: EnvSource = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION:
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  NEXT_PUBLIC_GOOGLE_PLACE_ID: process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID,
  VERCEL_ENV: process.env.VERCEL_ENV,
  VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
  NODE_ENV: process.env.NODE_ENV,
};
