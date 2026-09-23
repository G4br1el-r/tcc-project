import { REVIEWS } from "@/content/landing";
import { readToken, runtimeEnv } from "@/lib/env";
import { buildWriteReviewUrl } from "@/lib/google-reviews";

export function WriteReviewButton() {
  const placeId = readToken(runtimeEnv.NEXT_PUBLIC_GOOGLE_PLACE_ID);

  if (!placeId) {
    return <span className="btn btn--compact">{REVIEWS.writeReviewCta}</span>;
  }

  return (
    <a
      href={buildWriteReviewUrl(placeId)}
      className="btn btn--compact"
      target="_blank"
      rel="noopener noreferrer"
    >
      {REVIEWS.writeReviewCta}
      <span className="sr-only"> (abre em nova aba)</span>
    </a>
  );
}
