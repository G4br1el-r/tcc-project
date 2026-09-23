import { describe, expect, it } from "vitest";
import { buildSitemap, PUBLIC_ROUTES } from "./routes";

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
