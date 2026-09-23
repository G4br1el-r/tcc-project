import { readToken, resolveIndexable, resolveSiteUrl, runtimeEnv } from "./env";

export const SITE_NAME = "JP Assessoria Acadêmica";
export const SITE_SHORT_NAME = "JP Assessoria";
export const SITE_LANGUAGE = "pt-BR";
export const SITE_OG_LOCALE = "pt_BR";
export const SITE_COUNTRY_NAME = "Brasil";
export const SITE_TITLE = "Assessoria acadêmica para TCC, ABNT e revisão";
export const SITE_DESCRIPTION =
  "Assessoria acadêmica completa para TCC e artigos: estrutura, metodologia, normas ABNT e revisão com verificação de similaridade. Fale pelo WhatsApp.";
export const CONTENT_LAST_UPDATED = "2026-09-23";

export const THEME_COLOR = "#000000";

export const BRAND_MONOGRAM = {
  src: "/brand/monogram.png",
  width: 209,
  height: 256,
} as const;

export const siteUrl = resolveSiteUrl(runtimeEnv);
export const isIndexable = resolveIndexable(runtimeEnv);
export const googleSiteVerification = readToken(
  runtimeEnv.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
);

export function absoluteUrl(path: string, base: URL = siteUrl): string {
  return new URL(path, base).href;
}
