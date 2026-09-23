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

export const ADMIN_PATH = "/admin";
export const ADMIN_LOGIN_PATH = "/admin/login";
export const API_PATH_PREFIX = "/api/";

const TRAILING_SLASHES = /\/+$/;

export type AdminAccess = "allow" | "redirect-to-login" | "verify-session";

function normalizePath(pathname: string): string {
  return pathname.replace(TRAILING_SLASHES, "") || "/";
}

function isAdminPath(pathname: string): boolean {
  return pathname === ADMIN_PATH || pathname.startsWith(`${ADMIN_PATH}/`);
}

export function resolveAdminAccess(
  pathname: string,
  hasSessionCookie: boolean,
): AdminAccess {
  const path = normalizePath(pathname);
  if (path === ADMIN_LOGIN_PATH) {
    return hasSessionCookie ? "verify-session" : "allow";
  }
  if (isAdminPath(path)) {
    return hasSessionCookie ? "allow" : "redirect-to-login";
  }
  return "allow";
}

export function buildRobots(
  indexable: boolean,
  sitemapUrl: string,
): MetadataRoute.Robots {
  if (!indexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: API_PATH_PREFIX,
    },
    sitemap: sitemapUrl,
  };
}

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
