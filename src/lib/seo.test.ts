import { describe, expect, it } from "vitest";
import {
  buildJsonLd,
  buildPageMetadata,
  buildRobots,
  buildVerification,
  serializeJsonLd,
} from "./seo";

const SITE = new URL("https://assessoria.com.br");
const SERVICES = [
  { id: "normalizacao-abnt", name: "Normalização ABNT", description: "ABNT" },
];

function graphTypes(data: Readonly<Record<string, unknown>>): unknown[] {
  const graph: unknown = data["@graph"];
  if (!Array.isArray(graph)) return [];
  return graph.map((node: unknown) =>
    typeof node === "object" && node !== null && "@type" in node
      ? node["@type"]
      : undefined,
  );
}

describe("buildJsonLd", () => {
  it("describes organization, website, page and service", () => {
    const data = buildJsonLd({
      siteUrl: SITE,
      contactUrl: null,
      services: SERVICES,
    });
    expect(graphTypes(data)).toEqual([
      "Organization",
      "WebSite",
      "WebPage",
      "Service",
    ]);
  });

  it("adds a contact point only when a real contact url exists", () => {
    const without = JSON.stringify(
      buildJsonLd({ siteUrl: SITE, contactUrl: null, services: SERVICES }),
    );
    const withContact = JSON.stringify(
      buildJsonLd({
        siteUrl: SITE,
        contactUrl: "https://wa.me/5511987654321",
        services: SERVICES,
      }),
    );
    expect(without).not.toContain("ContactPoint");
    expect(withContact).toContain("https://wa.me/5511987654321");
  });

  it("uses absolute ids based on the site url", () => {
    const serialized = JSON.stringify(
      buildJsonLd({ siteUrl: SITE, contactUrl: null, services: SERVICES }),
    );
    expect(serialized).toContain(
      "https://assessoria.com.br/#normalizacao-abnt",
    );
  });
});

describe("serializeJsonLd", () => {
  it("escapes html-sensitive characters", () => {
    expect(serializeJsonLd({ name: "</script><script>" })).not.toContain("<");
  });
});

describe("buildRobots", () => {
  it("blocks indexing outside production", () => {
    expect(buildRobots(false)).toEqual({ index: false, follow: false });
  });

  it("allows indexing with large image previews in production", () => {
    expect(buildRobots(true)).toMatchObject({
      index: true,
      follow: true,
      googleBot: { "max-image-preview": "large" },
    });
  });
});

describe("buildVerification", () => {
  it("returns undefined without tokens", () => {
    expect(buildVerification({})).toBeUndefined();
  });

  it("maps the google token", () => {
    expect(buildVerification({ google: "g" })).toEqual({ google: "g" });
  });
});

describe("buildPageMetadata", () => {
  it("keeps shared open graph fields when setting the page url", () => {
    const metadata = buildPageMetadata("/");
    expect(metadata.alternates?.canonical).toBe("/");
    expect(metadata.openGraph).toMatchObject({
      url: "/",
      siteName: expect.any(String),
    });
  });
});
