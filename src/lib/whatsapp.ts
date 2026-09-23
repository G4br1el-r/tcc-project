import { runtimeEnv } from "./env";

const MIN_PHONE_DIGITS = 10;
const MAX_PHONE_DIGITS = 15;
const WHATSAPP_BASE_URL = "https://wa.me/";

export const WHATSAPP_FALLBACK_HREF = "/#contato";

export type WhatsAppContext =
  | "header"
  | "hero"
  | "services"
  | "process"
  | "faq"
  | "final";

const QUALIFYING_FIELDS = ["Curso:", "Em que ponto está:", "Prazo:"];

function withFields(opening: string, fields: ReadonlyArray<string>): string {
  return [opening, ...fields].join("\n");
}

export const WHATSAPP_MESSAGES: Readonly<Record<WhatsAppContext, string>> = {
  header: "Olá! Quero entender como funciona a assessoria acadêmica.",
  hero: withFields("Olá! Quero ajuda com meu trabalho acadêmico.", [
    "Curso:",
    "Tipo de trabalho:",
    "Prazo:",
  ]),
  services: withFields(
    "Olá! Ainda não sei qual etapa preciso. Posso descrever meu trabalho?",
    QUALIFYING_FIELDS,
  ),
  process: withFields(
    "Olá! Quero contar a situação do meu trabalho acadêmico.",
    QUALIFYING_FIELDS,
  ),
  faq: "Olá! Tenho uma dúvida sobre a assessoria acadêmica:",
  final:
    "Olá! Quero entender por onde seguir com meu trabalho acadêmico. Pode me ajudar?",
};

export function buildServiceMessage(serviceName: string): string {
  return `Olá! Tenho interesse em "${serviceName}". Quero contar em que ponto meu trabalho está e entender como funciona.`;
}

export function normalizeWhatsAppNumber(
  raw: string | undefined,
): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (digits.length < MIN_PHONE_DIGITS || digits.length > MAX_PHONE_DIGITS) {
    return null;
  }
  return digits;
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  return `${WHATSAPP_BASE_URL}${phone}?text=${encodeURIComponent(message)}`;
}

export function resolveWhatsAppHref(
  message: string,
  rawNumber: string | undefined = runtimeEnv.NEXT_PUBLIC_WHATSAPP_NUMBER,
): string {
  const phone = normalizeWhatsAppNumber(rawNumber);
  return phone ? buildWhatsAppUrl(phone, message) : WHATSAPP_FALLBACK_HREF;
}

export function isExternalWhatsAppHref(href: string): boolean {
  return href.startsWith(WHATSAPP_BASE_URL);
}
