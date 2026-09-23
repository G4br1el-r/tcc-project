import { cacheLife } from "next/cache";
import Image from "next/image";
import { FOOTER, NAV_LINKS } from "@/content/landing";
import { SITE_NAME } from "@/lib/site";
import {
  FIVE_MINUTES_IN_SECONDS,
  ONE_DAY_IN_SECONDS,
  ONE_YEAR_IN_SECONDS,
} from "@/lib/time";

const DEVELOPER_LOGO_SIZE = 64;

async function CurrentYear() {
  "use cache";
  cacheLife({
    stale: FIVE_MINUTES_IN_SECONDS,
    revalidate: ONE_DAY_IN_SECONDS,
    expire: ONE_YEAR_IN_SECONDS,
  });
  return new Date().getFullYear();
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <p className="brand__name">{SITE_NAME}</p>
            <p className="site-footer__statement">{FOOTER.statement}</p>
          </div>

          <nav className="site-footer__nav" aria-label="Rodapé">
            <ul>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
              <li>
                <a href="/#contato">Contato</a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="site-footer__legal">
          <p>
            © <CurrentYear /> {SITE_NAME}
          </p>
          <p className="site-footer__developer">
            <span>{FOOTER.developedBy}</span>
            <Image
              src="/brand/nsqnp.webp"
              alt="NSQNP"
              width={DEVELOPER_LOGO_SIZE}
              height={DEVELOPER_LOGO_SIZE}
              className="site-footer__developer-logo"
            />
            <span>{FOOTER.developerPhone}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
