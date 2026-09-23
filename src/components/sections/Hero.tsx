import { HeroMotion } from "@/components/motion/HeroMotion";
import { Backdrop } from "@/components/ui/Backdrop";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { HERO } from "@/content/landing";
import { PHOTOS } from "@/content/media";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { cssVars } from "@/lib/style";
import { WHATSAPP_MESSAGES } from "@/lib/whatsapp";

const HERO_FADE_ORDER = {
  lead: 0,
  actions: 1,
  reassurance: 2,
  scroll: 3,
} as const;

export function Hero() {
  return (
    <HeroMotion>
      <section className="hero" aria-labelledby="hero-title" data-hero>
        <Backdrop photo={PHOTOS.hero} eager decorative />

        <div className="shell hero__grid" data-hero-content>
          <h1 id="hero-title" className="hero__title">
            {HERO.titleLines.map((line, index) => (
              <span key={line} className="hero__line-mask">
                <span className="hero__line" style={cssVars({ "--i": index })}>
                  {line}
                </span>{" "}
              </span>
            ))}
          </h1>

          <p
            className="hero__scroll hero__fade"
            style={cssVars({ "--i": HERO_FADE_ORDER.scroll })}
          >
            {HERO.scrollHint}
          </p>

          <div className="hero__side">
            <p
              className="hero__lead hero__fade"
              style={cssVars({ "--i": HERO_FADE_ORDER.lead })}
            >
              {HERO.lead}
            </p>

            <div
              className="hero__actions hero__fade"
              style={cssVars({ "--i": HERO_FADE_ORDER.actions })}
            >
              <WhatsAppLink
                message={WHATSAPP_MESSAGES.hero}
                event={ANALYTICS_EVENTS.whatsappHero}
                className="btn"
                withIcon
              >
                {HERO.primaryCta}
              </WhatsAppLink>
              <a
                href="#como-funciona"
                className="text-link"
                data-track={ANALYTICS_EVENTS.heroSecondary}
              >
                {HERO.secondaryCta}
              </a>
            </div>

            <p
              className="hero__reassurance hero__fade"
              style={cssVars({ "--i": HERO_FADE_ORDER.reassurance })}
            >
              {HERO.reassurance}
            </p>
          </div>
        </div>
      </section>
    </HeroMotion>
  );
}
