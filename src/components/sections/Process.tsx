import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { PROCESS } from "@/content/landing";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { WHATSAPP_MESSAGES } from "@/lib/whatsapp";

const STEP_NUMBER_OFFSET = 1;

export function Process() {
  return (
    <section
      id="como-funciona"
      className="chapter"
      aria-labelledby="process-title"
      data-chapter
    >
      <div className="shell chapter__grid">
        <header className="chapter__header" data-reveal-group>
          <h2
            id="process-title"
            className="section-title chapter__title"
            data-reveal-lines
          >
            {PROCESS.title}
          </h2>
          <p className="section-text chapter__intro" data-reveal-fade>
            {PROCESS.text}
          </p>
        </header>

        <div className="chapter__body" data-chapter-body>
          <ol className="process__list">
            {PROCESS.steps.map((step, index) => (
              <li key={step.title} className="process__step" data-process-step>
                <span className="process__number" aria-hidden="true">
                  {index + STEP_NUMBER_OFFSET}
                </span>
                <h3 className="process__title">{step.title}</h3>
                <p className="process__text">{step.text}</p>
              </li>
            ))}
          </ol>
          <div className="process__cta" data-reveal-fade>
            <WhatsAppLink
              message={WHATSAPP_MESSAGES.process}
              event={ANALYTICS_EVENTS.whatsappProcess}
              className="btn"
              withIcon
            >
              {PROCESS.cta}
            </WhatsAppLink>
          </div>
        </div>
      </div>
    </section>
  );
}
