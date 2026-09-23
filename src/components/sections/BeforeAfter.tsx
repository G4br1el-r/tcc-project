import Image from "next/image";
import { BeforeAfterMotion } from "@/components/motion/BeforeAfterMotion";
import { BEFORE_AFTER } from "@/content/landing";
import { PHOTOS } from "@/content/media";

const COMPARISON_IMAGE_SIZES = "100vw";

export function BeforeAfter() {
  return (
    <BeforeAfterMotion>
      <section className="before-after" aria-labelledby="before-after-title">
        <div className="before-after__stage" data-ba-stage>
          <h2
            id="before-after-title"
            className="section-title before-after__title"
            data-ba-title
          >
            {BEFORE_AFTER.title}
          </h2>

          <div className="before-after__frame">
            <figure className="before-after__panel before-after__before">
              <div className="before-after__media" data-ba-before-media>
                <Image
                  src={PHOTOS.before.src}
                  alt={PHOTOS.before.alt}
                  fill
                  sizes={COMPARISON_IMAGE_SIZES}
                />
              </div>
              <figcaption className="before-after__caption">
                <p className="before-after__label">
                  {BEFORE_AFTER.beforeLabel}
                </p>
                <ul className="before-after__list">
                  {BEFORE_AFTER.before.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </figcaption>
            </figure>

            <figure
              className="before-after__panel before-after__after"
              data-ba-after
            >
              <div className="before-after__inner" data-ba-after-inner>
                <div className="before-after__media">
                  <Image
                    src={PHOTOS.after.src}
                    alt={PHOTOS.after.alt}
                    fill
                    sizes={COMPARISON_IMAGE_SIZES}
                  />
                </div>
                <figcaption className="before-after__caption">
                  <p className="before-after__label">
                    {BEFORE_AFTER.afterLabel}
                  </p>
                  <ul className="before-after__list">
                    {BEFORE_AFTER.after.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </figcaption>
              </div>
              <span className="before-after__divider" aria-hidden="true" />
            </figure>
          </div>
        </div>
      </section>
    </BeforeAfterMotion>
  );
}
