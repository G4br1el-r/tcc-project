import type { Metadata } from "next";
import { MotionRuntime } from "@/components/motion/MotionRuntime";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { ChaosToOrder } from "@/components/sections/ChaosToOrder";
import { Chapters } from "@/components/sections/Chapters";
import { FinalCta } from "@/components/sections/FinalCta";
import { GoogleReviews } from "@/components/sections/GoogleReviews";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Stats } from "@/components/sections/Stats";
import { WriteReviewButton } from "@/components/sections/WriteReviewButton";
import { JsonLd } from "@/components/seo/JsonLd";
import { SERVICES } from "@/content/landing";
import { MAIN_CONTENT_ID, PROGRAMMATIC_FOCUS_ONLY } from "@/lib/a11y";
import { buildJsonLd, buildPageMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import {
  isExternalWhatsAppHref,
  resolveWhatsAppHref,
  WHATSAPP_MESSAGES,
} from "@/lib/whatsapp";

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
      <main id={MAIN_CONTENT_ID} tabIndex={PROGRAMMATIC_FOCUS_ONLY}>
        <Hero />
        <Stats />
        <ChaosToOrder />
        <Services />
        <BeforeAfter />
        <Chapters />
        <FinalCta />
        <GoogleReviews>
          <WriteReviewButton />
        </GoogleReviews>
      </main>
      <MotionRuntime />
    </>
  );
}
