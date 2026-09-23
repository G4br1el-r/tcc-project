const PLACES_API_BASE_URL = "https://places.googleapis.com/v1/places/";
const WRITE_REVIEW_BASE_URL = "https://search.google.com/local/writereview";
const PLACE_DETAILS_FIELDS = [
  "rating",
  "userRatingCount",
  "googleMapsUri",
  "reviews",
] as const;
const REVIEWS_LANGUAGE = "pt-BR";
const MIN_RATING = 1;
const MAX_RATING = 5;
const MIN_REVIEW_COUNT = 0;

export const REVIEWS_ENDPOINT = "/api/reviews";

export type GoogleReview = {
  id: string;
  author: string;
  authorUrl: string | null;
  authorPhotoUrl: string | null;
  rating: number;
  text: string;
  relativeTime: string;
  reviewUrl: string | null;
};

export type GooglePlaceReviews = {
  rating: number | null;
  total: number | null;
  mapsUrl: string | null;
  reviews: GoogleReview[];
};

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function readHttpsUrl(value: unknown): string | null {
  const candidate = readString(value);
  if (!candidate) return null;
  try {
    const url = new URL(candidate);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

function readRating(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return value >= MIN_RATING && value <= MAX_RATING ? value : null;
}

function readCount(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isInteger(value)) return null;
  return value >= MIN_REVIEW_COUNT ? value : null;
}

function readLocalizedText(value: unknown): string | null {
  return isRecord(value) ? readString(value.text) : null;
}

function parseReview(value: unknown, index: number): GoogleReview | null {
  if (!isRecord(value)) return null;

  const author = isRecord(value.authorAttribution)
    ? value.authorAttribution
    : {};
  const authorName = readString(author.displayName);
  const rating = readRating(value.rating);
  const text =
    readLocalizedText(value.text) ?? readLocalizedText(value.originalText);
  if (!authorName || rating === null || !text) return null;

  return {
    id: readString(value.name) ?? `review-${index}`,
    author: authorName,
    authorUrl: readHttpsUrl(author.uri),
    authorPhotoUrl: readHttpsUrl(author.photoUri),
    rating: Math.round(rating),
    text,
    relativeTime: readString(value.relativePublishTimeDescription) ?? "",
    reviewUrl: readHttpsUrl(value.googleMapsUri),
  };
}

export function buildWriteReviewUrl(placeId: string): string {
  const url = new URL(WRITE_REVIEW_BASE_URL);
  url.searchParams.set("placeid", placeId);
  return url.href;
}

export function buildPlaceDetailsRequest(
  placeId: string,
  apiKey: string,
): { url: string; headers: Record<string, string> } {
  const url = new URL(encodeURIComponent(placeId), PLACES_API_BASE_URL);
  url.searchParams.set("languageCode", REVIEWS_LANGUAGE);

  return {
    url: url.href,
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": PLACE_DETAILS_FIELDS.join(","),
    },
  };
}

export function parsePlaceReviews(value: unknown): GooglePlaceReviews | null {
  if (!isRecord(value)) return null;

  const reviews = Array.isArray(value.reviews)
    ? value.reviews.map(parseReview).filter((review) => review !== null)
    : [];

  return {
    rating: readRating(value.rating),
    total: readCount(value.userRatingCount),
    mapsUrl: readHttpsUrl(value.googleMapsUri),
    reviews,
  };
}

export function readReviewsPayload(value: unknown): GooglePlaceReviews | null {
  if (!isRecord(value) || !Array.isArray(value.reviews)) return null;

  const reviews = value.reviews.filter(
    (review): review is GoogleReview =>
      isRecord(review) &&
      typeof review.id === "string" &&
      typeof review.author === "string" &&
      typeof review.text === "string" &&
      typeof review.relativeTime === "string" &&
      readRating(review.rating) !== null &&
      (review.authorUrl === null || readHttpsUrl(review.authorUrl) !== null) &&
      (review.authorPhotoUrl === null ||
        readHttpsUrl(review.authorPhotoUrl) !== null) &&
      (review.reviewUrl === null || readHttpsUrl(review.reviewUrl) !== null),
  );

  return {
    rating: readRating(value.rating),
    total: readCount(value.total),
    mapsUrl: readHttpsUrl(value.mapsUrl),
    reviews,
  };
}
