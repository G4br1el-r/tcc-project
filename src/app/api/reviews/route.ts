import { cacheLife, cacheTag } from "next/cache";
import { connection } from "next/server";
import { readToken } from "@/lib/env";
import {
  buildPlaceDetailsRequest,
  type GooglePlaceReviews as GooglePlaceReviewsResponse,
  parsePlaceReviews,
} from "@/lib/google-reviews";
import { MOCK_REVIEWS_PLACE } from "@/lib/google-reviews-mock";
import {
  FIVE_MINUTES_IN_SECONDS,
  ONE_DAY_IN_SECONDS,
  SIX_HOURS_IN_SECONDS,
} from "@/lib/time";

const REVIEWS_CACHE_ENABLED = true;
const REVIEWS_CACHE_TAG = "google-reviews";
const REQUEST_TIMEOUT_MS = 5000;
const SERVICE_UNAVAILABLE_STATUS = 503;
const NO_REVIEWS = 0;
const NO_STORE_HEADERS = { "Cache-Control": "no-store" };
const CDN_CACHE_HEADERS = {
  "Cache-Control": `public, s-maxage=${SIX_HOURS_IN_SECONDS}, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
};

function unavailable(): Response {
  return new Response(null, {
    status: SERVICE_UNAVAILABLE_STATUS,
    headers: NO_STORE_HEADERS,
  });
}

function readMockOverride(): GooglePlaceReviewsResponse | null {
  if (process.env.NODE_ENV !== "development") return null;
  if (readToken(process.env.REVIEWS_MOCK) !== "true") return null;
  return MOCK_REVIEWS_PLACE;
}

async function fetchPlaceReviews(
  placeId: string,
): Promise<GooglePlaceReviewsResponse> {
  const apiKey = readToken(process.env.GOOGLE_PLACES_API_KEY);
  if (!apiKey) throw new Error("GOOGLE_PLACES_API_KEY ausente.");

  const request = buildPlaceDetailsRequest(placeId, apiKey);
  const response = await fetch(request.url, {
    headers: request.headers,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`Google Places respondeu com status ${response.status}.`);
  }

  const place = parsePlaceReviews(await response.json());
  if (!place || place.reviews.length === NO_REVIEWS) {
    throw new Error("Google Places não retornou avaliações.");
  }
  return place;
}

async function fetchCachedPlaceReviews(
  placeId: string,
): Promise<GooglePlaceReviewsResponse> {
  "use cache";
  cacheTag(REVIEWS_CACHE_TAG);
  cacheLife({
    stale: FIVE_MINUTES_IN_SECONDS,
    revalidate: SIX_HOURS_IN_SECONDS,
    expire: ONE_DAY_IN_SECONDS,
  });
  return fetchPlaceReviews(placeId);
}

const loadPlaceReviews = REVIEWS_CACHE_ENABLED
  ? fetchCachedPlaceReviews
  : fetchPlaceReviews;
const SUCCESS_HEADERS = REVIEWS_CACHE_ENABLED
  ? CDN_CACHE_HEADERS
  : NO_STORE_HEADERS;

export async function GET(): Promise<Response> {
  await connection();

  const mock = readMockOverride();
  if (mock) return Response.json(mock, { headers: NO_STORE_HEADERS });

  const placeId = readToken(process.env.GOOGLE_PLACE_ID);
  const hasApiKey = readToken(process.env.GOOGLE_PLACES_API_KEY) !== undefined;
  if (!placeId || !hasApiKey) return unavailable();

  try {
    const place = await loadPlaceReviews(placeId);
    return Response.json(place, { headers: SUCCESS_HEADERS });
  } catch (error: unknown) {
    console.error(
      "Falha ao consultar o Google Places:",
      error instanceof Error ? error.message : error,
    );
    return unavailable();
  }
}
