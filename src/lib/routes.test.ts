import { describe, expect, it } from "vitest";
import {
  buildRobots,
  buildSitemap,
  PUBLIC_ROUTES,
  resolveAdminAccess,
} from "./routes";

const SITEMAP_URL = "https://assessoria.com.br/sitemap.xml";

describe("buildRobots", () => {
  it("blocks everything when the site is not indexable", () => {
    expect(buildRobots(false, SITEMAP_URL)).toEqual({
      rules: { userAgent: "*", disallow: "/" },
    });
  });

  it("allows the site, blocks the api and leaves the admin to noindex", () => {
    const robots = buildRobots(true, SITEMAP_URL);
    expect(robots.sitemap).toBe(SITEMAP_URL);
    expect(robots.rules).toEqual({
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    });
  });
});

describe("buildSitemap", () => {
  it("produces absolute urls for every public route", () => {
    const sitemap = buildSitemap(
      PUBLIC_ROUTES,
      new URL("https://assessoria.com.br"),
    );
    expect(sitemap.map((entry) => entry.url)).toContain(
      "https://assessoria.com.br/",
    );
    expect(sitemap).toHaveLength(PUBLIC_ROUTES.length);
  });
});

describe("resolveAdminAccess", () => {
  it("sends visitors without a session cookie to the login", () => {
    expect(resolveAdminAccess("/admin", false)).toBe("redirect-to-login");
    expect(resolveAdminAccess("/admin/", false)).toBe("redirect-to-login");
    expect(resolveAdminAccess("/admin/faq", false)).toBe("redirect-to-login");
  });

  it("lets the admin through when a session cookie exists", () => {
    expect(resolveAdminAccess("/admin", true)).toBe("allow");
  });

  it("shows the login to visitors without a session cookie", () => {
    expect(resolveAdminAccess("/admin/login", false)).toBe("allow");
    expect(resolveAdminAccess("/admin/login/", false)).toBe("allow");
  });

  it("verifies the session before bouncing a logged user off the login", () => {
    expect(resolveAdminAccess("/admin/login", true)).toBe("verify-session");
  });

  it("ignores routes outside the admin", () => {
    expect(resolveAdminAccess("/", false)).toBe("allow");
    expect(resolveAdminAccess("/administracao", false)).toBe("allow");
  });
});
