import { describe, expect, it } from "vitest";
import {
  buildPlaceDetailsRequest,
  buildWriteReviewUrl,
  type GooglePlaceReviews,
  parsePlaceReviews,
  readReviewsPayload,
} from "./google-reviews";

const VALID_REVIEW = {
  name: "places/abc/reviews/1",
  relativePublishTimeDescription: "há 2 meses",
  rating: 5,
  text: { text: "Atendimento excelente.", languageCode: "pt" },
  authorAttribution: {
    displayName: "Maria Souza",
    uri: "https://www.google.com/maps/contrib/123",
    photoUri: "https://lh3.googleusercontent.com/a/foto",
  },
  googleMapsUri: "https://www.google.com/maps/reviews/xyz",
};

const PLACE_RESPONSE = {
  rating: 4.9,
  userRatingCount: 37,
  googleMapsUri: "https://maps.google.com/?cid=1",
  reviews: [VALID_REVIEW],
};

describe("buildPlaceDetailsRequest", () => {
  it("builds the Places API (New) request with field mask and language", () => {
    const request = buildPlaceDetailsRequest("ChIJ/abc", "chave");
    expect(request.url).toBe(
      "https://places.googleapis.com/v1/places/ChIJ%2Fabc?languageCode=pt-BR",
    );
    expect(request.headers).toEqual({
      "X-Goog-Api-Key": "chave",
      "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
    });
  });
});

describe("buildWriteReviewUrl", () => {
  it("builds the Google review link with the place id", () => {
    expect(buildWriteReviewUrl("ChIJ/abc")).toBe(
      "https://search.google.com/local/writereview?placeid=ChIJ%2Fabc",
    );
  });
});

describe("parsePlaceReviews", () => {
  it("maps a complete response", () => {
    expect(parsePlaceReviews(PLACE_RESPONSE)).toEqual({
      rating: 4.9,
      total: 37,
      mapsUrl: "https://maps.google.com/?cid=1",
      reviews: [
        {
          id: "places/abc/reviews/1",
          author: "Maria Souza",
          authorUrl: "https://www.google.com/maps/contrib/123",
          authorPhotoUrl: "https://lh3.googleusercontent.com/a/foto",
          rating: 5,
          text: "Atendimento excelente.",
          relativeTime: "há 2 meses",
          reviewUrl: "https://www.google.com/maps/reviews/xyz",
        },
      ],
    });
  });

  it("returns an empty list when the place has no reviews", () => {
    expect(parsePlaceReviews({ rating: 5 })?.reviews).toEqual([]);
  });

  it("drops reviews without author, text or valid rating", () => {
    const result = parsePlaceReviews({
      reviews: [
        { ...VALID_REVIEW, authorAttribution: {} },
        { ...VALID_REVIEW, text: { text: "   " } },
        { ...VALID_REVIEW, rating: 9 },
        "lixo",
        VALID_REVIEW,
      ],
    });
    expect(result?.reviews).toHaveLength(1);
  });

  it("falls back to the original text", () => {
    const result = parsePlaceReviews({
      reviews: [
        { ...VALID_REVIEW, text: undefined, originalText: { text: "Ótimo." } },
      ],
    });
    expect(result?.reviews[0]?.text).toBe("Ótimo.");
  });

  it("rejects non-https links", () => {
    const result = parsePlaceReviews({
      googleMapsUri: "javascript:alert(1)",
      reviews: [
        {
          ...VALID_REVIEW,
          authorAttribution: {
            displayName: "Ana",
            uri: "http://exemplo.com",
            photoUri: "data:image/png;base64,AAA",
          },
        },
      ],
    });
    expect(result?.mapsUrl).toBeNull();
    expect(result?.reviews[0]?.authorUrl).toBeNull();
    expect(result?.reviews[0]?.authorPhotoUrl).toBeNull();
  });

  it("returns null for invalid payloads", () => {
    expect(parsePlaceReviews(null)).toBeNull();
    expect(parsePlaceReviews("erro")).toBeNull();
    expect(parsePlaceReviews([])).toBeNull();
  });
});

describe("readReviewsPayload", () => {
  it("accepts what the route returns", () => {
    const payload = parsePlaceReviews(PLACE_RESPONSE);
    const roundTrip: unknown = JSON.parse(JSON.stringify(payload));
    expect(readReviewsPayload(roundTrip)).toEqual<GooglePlaceReviews | null>(
      payload,
    );
  });

  it("filters tampered reviews and rejects invalid shapes", () => {
    const payload = readReviewsPayload({
      rating: 5,
      total: 1,
      mapsUrl: null,
      reviews: [{ id: "x", author: "Ana", text: "Ok", rating: 5 }],
    });
    expect(payload?.reviews).toEqual([]);
    expect(readReviewsPayload({ reviews: "nada" })).toBeNull();
  });
});
