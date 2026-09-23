import type { Metadata } from "next";
import Link from "next/link";
import { AnalyticsListener } from "@/components/analytics/AnalyticsListener";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { MAIN_CONTENT_ID, PROGRAMMATIC_FOCUS_ONLY } from "@/lib/a11y";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { WHATSAPP_MESSAGES } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <SkipLink />
      <Header />
      <main
        id={MAIN_CONTENT_ID}
        className="not-found"
        tabIndex={PROGRAMMATIC_FOCUS_ONLY}
      >
        <div className="shell">
          <h1 className="not-found__title">
            Esta página não existe ou mudou de lugar.
          </h1>
          <p className="section-text not-found__text">
            Volte ao início para conhecer a assessoria ou fale direto com a
            gente.
          </p>
          <div className="not-found__actions">
            <Link href="/" className="btn">
              Voltar ao início
            </Link>
            <WhatsAppLink
              message={WHATSAPP_MESSAGES.header}
              event={ANALYTICS_EVENTS.whatsappHeader}
              className="text-link"
            >
              Falar no WhatsApp
            </WhatsAppLink>
          </div>
        </div>
      </main>
      <Footer />
      <AnalyticsListener />
    </>
  );
}
