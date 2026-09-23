import { TRUST } from "@/content/landing";

export function Trust() {
  return (
    <section className="chapter" aria-labelledby="trust-title" data-chapter>
      <div className="shell chapter__grid">
        <header className="chapter__header" data-reveal-group>
          <h2
            id="trust-title"
            className="section-title chapter__title"
            data-reveal-lines
          >
            {TRUST.title}
          </h2>
          <p className="section-text chapter__intro" data-reveal-fade>
            {TRUST.intro}
          </p>
        </header>

        <div className="chapter__body" data-chapter-body>
          <dl className="trust__principles" data-reveal-group>
            {TRUST.principles.map((principle) => (
              <div
                key={principle.title}
                className="trust__principle"
                data-reveal-fade
              >
                <dt>{principle.title}</dt>
                <dd>{principle.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
