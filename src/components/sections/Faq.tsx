import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { FAQ } from "@/content/landing";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { getPublishedFaq } from "@/lib/faq";
import { WHATSAPP_MESSAGES } from "@/lib/whatsapp";

export async function Faq() {
  const items = await getPublishedFaq();

  return (
    <section
      id="duvidas"
      className="chapter"
      aria-labelledby="faq-title"
      data-chapter
    >
      <div className="shell chapter__grid">
        <header className="chapter__header" data-reveal-group>
          <h2
            id="faq-title"
            className="section-title chapter__title"
            data-reveal-lines
          >
            {FAQ.title}
          </h2>
          <p className="section-text chapter__intro" data-reveal-fade>
            {FAQ.intro}
          </p>
        </header>

        <div className="chapter__body" data-chapter-body>
          <div className="faq__list" data-reveal-group>
            {items.map((item) => (
              <details
                key={item.id}
                className="faq__item"
                data-faq={item.id}
                data-reveal-fade
              >
                <summary className="faq__question">{item.question}</summary>
                <p className="faq__answer">{item.answer}</p>
              </details>
            ))}

            <p className="faq__closing" data-reveal-fade>
              <span>{FAQ.closingText}</span>
              <WhatsAppLink
                message={WHATSAPP_MESSAGES.faq}
                event={ANALYTICS_EVENTS.whatsappFaq}
                className="text-link"
              >
                {FAQ.closingCta}
              </WhatsAppLink>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
