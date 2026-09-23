import { FOOTER, NAV_LINKS } from "@/content/landing";
import { PHOTOS } from "@/content/media";
import { SITE_NAME } from "@/lib/site";

const photoCredits = Object.values(PHOTOS).map((photo) => photo.credit);

export function Footer() {
  const year = new Date().getFullYear();

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
            © {year} {SITE_NAME}
          </p>
          <div className="site-footer__credits">
            <span>Fotos de</span>
            <ul>
              {photoCredits.map((credit) => (
                <li key={credit.url}>
                  <a
                    href={credit.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {credit.author}
                  </a>
                </li>
              ))}
            </ul>
            <span>no Unsplash</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
