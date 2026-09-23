import { FinalCtaMotion } from "@/components/motion/FinalCtaMotion";
import { Backdrop } from "@/components/ui/Backdrop";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { FINAL_CTA } from "@/content/landing";
import { PHOTOS } from "@/content/media";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { WHATSAPP_MESSAGES } from "@/lib/whatsapp";

export function FinalCta() {
  return (
    <FinalCtaMotion>
      <section
        id="contato"
        className="final"
        aria-labelledby="final-title"
        data-final
      >
        <Backdrop photo={PHOTOS.library} decorative />

        <div className="shell final__inner" data-reveal-group>
          <h2 id="final-title" className="final__title" data-reveal-lines>
            {FINAL_CTA.title}
          </h2>
          <p className="final__text" data-reveal-fade>
            {FINAL_CTA.text}
          </p>
          <div className="final__actions" data-reveal-fade>
            <WhatsAppLink
              message={WHATSAPP_MESSAGES.final}
              event={ANALYTICS_EVENTS.whatsappFinal}
              className="btn btn--large"
              withIcon
            >
              {FINAL_CTA.cta}
            </WhatsAppLink>
          </div>
        </div>
      </section>
    </FinalCtaMotion>
  );
}
