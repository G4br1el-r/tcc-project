import Image from "next/image";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { NAV_LINKS } from "@/content/landing";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { BRAND_MONOGRAM, SITE_NAME } from "@/lib/site";
import { WHATSAPP_MESSAGES } from "@/lib/whatsapp";

export function Header() {
  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <a href="/" className="brand" aria-label={`${SITE_NAME}, início`}>
          <Image
            src={BRAND_MONOGRAM.src}
            alt=""
            width={BRAND_MONOGRAM.width}
            height={BRAND_MONOGRAM.height}
            className="brand__mark"
            loading="eager"
          />
          <span className="brand__name">{SITE_NAME}</span>
        </a>

        <nav className="site-nav" aria-label="Principal">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <WhatsAppLink
          message={WHATSAPP_MESSAGES.header}
          event={ANALYTICS_EVENTS.whatsappHeader}
          className="btn btn--compact"
          withIcon
        >
          Falar no WhatsApp
        </WhatsAppLink>
      </div>
    </header>
  );
}
