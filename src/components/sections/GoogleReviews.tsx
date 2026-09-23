"use client";

import Image from "next/image";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { ReviewsMotion } from "@/components/motion/ReviewsMotion";
import { REVIEWS } from "@/content/landing";
import { formatCount, formatRating } from "@/lib/format";
import {
  type GooglePlaceReviews,
  type GoogleReview,
  REVIEWS_ENDPOINT,
  readReviewsPayload,
} from "@/lib/google-reviews";
import { ScrollTrigger } from "@/lib/gsap";
import { cssVars } from "@/lib/style";

const PREFETCH_MARGIN = "200% 0px 200% 0px";
const REFRESH_WHEN_IDLE = true;
const REVIEWS_TO_SHOW = 5;
const FIRST_REVIEW = 0;
const PLACEHOLDER_KEYS = ["primeira", "segunda", "terceira"] as const;
const NO_REVIEWS = 0;
const AVATAR_SIZE = 40;
const MAX_STARS = 5;

function ExternalLabel() {
  return <span className="sr-only"> (abre em nova aba)</span>;
}

function ReviewItem({ review }: { review: GoogleReview }) {
  return (
    <figure className="review" data-reveal-fade>
      <span className="review__quote" aria-hidden="true">
        “
      </span>
      <span
        className="review__stars"
        role="img"
        aria-label={`Nota ${review.rating} de ${MAX_STARS}`}
        style={cssVars({ "--stars": review.rating })}
      />
      <blockquote className="review__text">
        <p>{review.text}</p>
      </blockquote>
      <figcaption className="review__author">
        {review.authorPhotoUrl ? (
          <Image
            src={review.authorPhotoUrl}
            alt=""
            width={AVATAR_SIZE}
            height={AVATAR_SIZE}
            className="review__avatar"
            unoptimized
          />
        ) : null}
        <span className="review__meta">
          {review.authorUrl ? (
            <a
              href={review.authorUrl}
              className="review__name"
              target="_blank"
              rel="noopener noreferrer"
            >
              {review.author}
              <ExternalLabel />
            </a>
          ) : (
            <span className="review__name">{review.author}</span>
          )}
          {review.relativeTime ? (
            <span className="review__time">{review.relativeTime}</span>
          ) : null}
          {review.reviewUrl ? (
            <a
              href={review.reviewUrl}
              className="review__more"
              target="_blank"
              rel="noopener noreferrer"
            >
              {REVIEWS.fullReviewCta}
              <ExternalLabel />
            </a>
          ) : null}
        </span>
      </figcaption>
    </figure>
  );
}

function ReviewsSummary({ place }: { place: GooglePlaceReviews }) {
  if (place.rating === null) return null;

  return (
    <p className="reviews__summary">
      <span className="reviews__score">{formatRating(place.rating)}</span>{" "}
      {REVIEWS.outOf}
      {place.total !== null
        ? ` · ${formatCount(place.total)} ${REVIEWS.countLabel}`
        : null}
    </p>
  );
}

function ReviewsList({ place }: { place: GooglePlaceReviews }) {
  return (
    <>
      <ul className="reviews__list">
        {place.reviews.slice(FIRST_REVIEW, REVIEWS_TO_SHOW).map((review) => (
          <li key={review.id}>
            <ReviewItem review={review} />
          </li>
        ))}
      </ul>

      {place.mapsUrl ? (
        <p className="reviews__source" data-reveal-fade>
          <a
            href={place.mapsUrl}
            className="text-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {REVIEWS.allReviewsCta}
            <ExternalLabel />
          </a>
        </p>
      ) : null}
    </>
  );
}

function ReviewsPlaceholder() {
  return (
    <ul className="reviews__list reviews__placeholder" aria-hidden="true">
      {PLACEHOLDER_KEYS.map((key) => (
        <li key={key}>
          <div className="review review--placeholder">
            <span className="placeholder-line placeholder-line--stars" />
            <span className="placeholder-line" />
            <span className="placeholder-line" />
            <span className="placeholder-line placeholder-line--short" />
            <span className="placeholder-line placeholder-line--author" />
          </div>
        </li>
      ))}
    </ul>
  );
}

type ReviewsState =
  | { status: "loading" }
  | { status: "ready"; place: GooglePlaceReviews }
  | { status: "unavailable" };

const LOADING: ReviewsState = { status: "loading" };
const UNAVAILABLE: ReviewsState = { status: "unavailable" };

export function GoogleReviews({ children }: { children?: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const [state, setState] = useState<ReviewsState>(LOADING);
  const place = state.status === "ready" ? state.place : null;

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const controller = new AbortController();

    const load = async () => {
      try {
        const response = await fetch(REVIEWS_ENDPOINT, {
          signal: controller.signal,
        });
        const payload = response.ok
          ? readReviewsPayload(await response.json())
          : null;
        setState(
          payload && payload.reviews.length > NO_REVIEWS
            ? { status: "ready", place: payload }
            : UNAVAILABLE,
        );
      } catch {
        if (!controller.signal.aborted) setState(UNAVAILABLE);
      }
    };

    const prefetch = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        prefetch.disconnect();
        void load();
      },
      { rootMargin: PREFETCH_MARGIN },
    );
    prefetch.observe(element);

    return () => {
      controller.abort();
      prefetch.disconnect();
    };
  }, []);

  useEffect(() => {
    if (state.status !== "loading") ScrollTrigger.refresh(REFRESH_WHEN_IDLE);
  }, [state.status]);

  return (
    <section
      ref={root}
      id="avaliacoes"
      className="reviews shell"
      aria-labelledby="reviews-title"
      aria-busy={state.status === "loading"}
    >
      <ReviewsMotion>
        <header className="reviews__header" data-reveal-group>
          <div>
            <h2
              id="reviews-title"
              className="section-title reviews__title"
              data-reveal-lines
            >
              {REVIEWS.title}
            </h2>
            <p className="reviews__caption" data-reveal-fade>
              {REVIEWS.source}
            </p>
          </div>
          {place || children ? (
            <div className="reviews__cta" data-reveal-fade>
              {place ? <ReviewsSummary place={place} /> : null}
              {children}
            </div>
          ) : null}
        </header>
      </ReviewsMotion>

      {state.status === "loading" ? <ReviewsPlaceholder /> : null}

      {place ? (
        <ReviewsMotion>
          <div data-reveal-group>
            <ReviewsList place={place} />
          </div>
        </ReviewsMotion>
      ) : null}
    </section>
  );
}
