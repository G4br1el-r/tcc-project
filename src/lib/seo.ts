import type { Metadata } from "next";
import type { Service } from "@/content/landing";
import {
  CONTENT_LAST_UPDATED,
  googleSiteVerification,
  isIndexable,
  SITE_COUNTRY_NAME,
  SITE_DESCRIPTION,
  SITE_LANGUAGE,
  SITE_NAME,
  SITE_OG_LOCALE,
  SITE_TITLE,
  siteUrl,
} from "./site";

const UNLIMITED_PREVIEW_LENGTH = -1;
const BRAND_LOGO_PATH = "/brand/monogram.png";

export const DEFAULT_TITLE = `${SITE_TITLE} | ${SITE_NAME}`;

type VerificationTokens = { google?: string };

export function buildVerification({
  google,
}: VerificationTokens): Metadata["verification"] {
  if (!google) return undefined;
  return { google };
}

export function buildRobots(indexable: boolean): Metadata["robots"] {
  if (!indexable) return { index: false, follow: false };
  return {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": UNLIMITED_PREVIEW_LENGTH,
      "max-video-preview": UNLIMITED_PREVIEW_LENGTH,
    },
  };
}

export const SHARED_OPEN_GRAPH = {
  type: "website",
  locale: SITE_OG_LOCALE,
  siteName: SITE_NAME,
  title: DEFAULT_TITLE,
  description: SITE_DESCRIPTION,
} as const satisfies Metadata["openGraph"];

export function buildPageMetadata(path: string): Metadata {
  return {
    alternates: { canonical: path },
    openGraph: { ...SHARED_OPEN_GRAPH, url: path },
  };
}

export function buildRootMetadata(): Metadata {
  return {
    metadataBase: siteUrl,
    title: { default: DEFAULT_TITLE, template: `%s | ${SITE_NAME}` },
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "education",
    formatDetection: { telephone: false, email: false, address: false },
    openGraph: SHARED_OPEN_GRAPH,
    twitter: {
      card: "summary_large_image",
      title: DEFAULT_TITLE,
      description: SITE_DESCRIPTION,
    },
    robots: buildRobots(isIndexable),
    verification: buildVerification({ google: googleSiteVerification }),
  };
}

type JsonLdInput = {
  siteUrl: URL;
  contactUrl: string | null;
  services: ReadonlyArray<Pick<Service, "id" | "name" | "description">>;
};

export type JsonLdNode = Readonly<Record<string, unknown>>;

export function buildJsonLd({
  siteUrl: base,
  contactUrl,
  services,
}: JsonLdInput): JsonLdNode {
  const home = new URL("/", base).href;
  const organizationId = `${home}#organization`;
  const websiteId = `${home}#website`;
  const serviceId = `${home}#service`;

  const organization: JsonLdNode = {
    "@type": "Organization",
    "@id": organizationId,
    name: SITE_NAME,
    url: home,
    logo: new URL(BRAND_LOGO_PATH, base).href,
    description: SITE_DESCRIPTION,
    areaServed: { "@type": "Country", name: SITE_COUNTRY_NAME },
    ...(contactUrl
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            url: contactUrl,
            availableLanguage: SITE_LANGUAGE,
          },
        }
      : {}),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: home,
        name: SITE_NAME,
        inLanguage: SITE_LANGUAGE,
        publisher: { "@id": organizationId },
      },
      {
        "@type": "WebPage",
        "@id": `${home}#webpage`,
        url: home,
        name: DEFAULT_TITLE,
        description: SITE_DESCRIPTION,
        inLanguage: SITE_LANGUAGE,
        dateModified: CONTENT_LAST_UPDATED,
        isPartOf: { "@id": websiteId },
        about: { "@id": serviceId },
      },
      {
        "@type": "Service",
        "@id": serviceId,
        name: "Assessoria acadêmica",
        serviceType: "Assessoria acadêmica",
        description: SITE_DESCRIPTION,
        provider: { "@id": organizationId },
        areaServed: { "@type": "Country", name: SITE_COUNTRY_NAME },
        ...(contactUrl
          ? {
              availableChannel: {
                "@type": "ServiceChannel",
                serviceUrl: contactUrl,
                availableLanguage: SITE_LANGUAGE,
              },
            }
          : {}),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Serviços de assessoria acadêmica",
          itemListElement: services.map((service) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              "@id": `${home}#${service.id}`,
              name: service.name,
              description: service.description,
            },
          })),
        },
      },
    ],
  };
}

export function serializeJsonLd(data: JsonLdNode): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
