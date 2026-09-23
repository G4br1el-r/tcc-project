import type { MetadataRoute } from "next";
import { absoluteUrl, CONTENT_LAST_UPDATED } from "./site";

type SitemapEntry = MetadataRoute.Sitemap[number];

export type PublicRoute = {
  path: string;
  lastModified: string;
  changeFrequency: NonNullable<SitemapEntry["changeFrequency"]>;
  priority: number;
};

const HOME_PRIORITY = 1;

export const PUBLIC_ROUTES: ReadonlyArray<PublicRoute> = [
  {
    path: "/",
    lastModified: CONTENT_LAST_UPDATED,
    changeFrequency: "monthly",
    priority: HOME_PRIORITY,
  },
];

export function buildSitemap(
  routes: ReadonlyArray<PublicRoute>,
  base?: URL,
): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: absoluteUrl(route.path, base),
    lastModified: route.lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
