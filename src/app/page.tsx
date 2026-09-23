import type { Metadata } from "next";
import { MotionRuntime } from "@/components/motion/MotionRuntime";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { ChaosToOrder } from "@/components/sections/ChaosToOrder";
import { Chapters } from "@/components/sections/Chapters";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Stats } from "@/components/sections/Stats";
import { JsonLd } from "@/components/seo/JsonLd";
import { SERVICES } from "@/content/landing";
import { buildJsonLd, buildPageMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import {
  isExternalWhatsAppHref,
  resolveWhatsAppHref,
  WHATSAPP_MESSAGES,
} from "@/lib/whatsapp";

const PROGRAMMATIC_FOCUS_ONLY = -1;

export const metadata: Metadata = buildPageMetadata("/");

export default function Home() {
  const contactHref = resolveWhatsAppHref(WHATSAPP_MESSAGES.header);
  const jsonLd = buildJsonLd({
    siteUrl,
    contactUrl: isExternalWhatsAppHref(contactHref) ? contactHref : null,
    services: SERVICES,
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <main id="conteudo" tabIndex={PROGRAMMATIC_FOCUS_ONLY}>
        <Hero />
        <Stats />
        <ChaosToOrder />
        <Services />
        <BeforeAfter />
        <Chapters />
        <FinalCta />
      </main>
      <MotionRuntime />
    </>
  );
}
