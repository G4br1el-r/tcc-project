import { ServicesMotion } from "@/components/motion/ServicesMotion";
import { Backdrop } from "@/components/ui/Backdrop";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { SERVICES, SERVICES_INTRO } from "@/content/landing";
import { PHOTOS } from "@/content/media";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { buildServiceMessage, WHATSAPP_MESSAGES } from "@/lib/whatsapp";

const INDEX_OFFSET = 1;
const INDEX_PAD_LENGTH = 2;

function formatIndex(index: number): string {
  return String(index + INDEX_OFFSET).padStart(INDEX_PAD_LENGTH, "0");
}

export function Services() {
  return (
    <ServicesMotion>
      <section
        id="servicos"
        className="services"
        aria-labelledby="services-title"
        data-services
      >
        <Backdrop photo={PHOTOS.shelves} decorative />

        <div className="shell services__intro" data-reveal-group>
          <h2 id="services-title" className="section-title" data-reveal-lines>
            {SERVICES_INTRO.title}
          </h2>
          <p className="section-text services__text" data-reveal-fade>
            {SERVICES_INTRO.text}
          </p>
          <p className="services__hint" data-reveal-fade>
            {SERVICES_INTRO.scrollHint}
          </p>
        </div>

        <div className="services__viewport" data-services-viewport>
          <ul className="services__track" data-services-track>
            {SERVICES.map((service, index) => (
              <li
                key={service.id}
                id={service.id}
                className="service"
                data-service={service.id}
              >
                <div>
                  <span className="service__index" aria-hidden="true">
                    {formatIndex(index)}
                  </span>
                  <h3 className="service__name">{service.name}</h3>
                  <p className="service__text">{service.description}</p>
                </div>
                <WhatsAppLink
                  message={buildServiceMessage(service.name)}
                  event={ANALYTICS_EVENTS.whatsappService}
                  trackId={service.id}
                  className="text-link"
                  ariaLabel={`${SERVICES_INTRO.itemCta}: ${service.name}`}
                >
                  {SERVICES_INTRO.itemCta}
                </WhatsAppLink>
              </li>
            ))}
          </ul>
        </div>

        <p className="shell services__undecided">
          <span>{SERVICES_INTRO.undecidedText}</span>
          <WhatsAppLink
            message={WHATSAPP_MESSAGES.services}
            event={ANALYTICS_EVENTS.whatsappService}
            trackId="indeciso"
            className="text-link"
          >
            {SERVICES_INTRO.undecidedCta}
          </WhatsAppLink>
        </p>
      </section>
    </ServicesMotion>
  );
}
