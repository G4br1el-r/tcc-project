import { describe, expect, it } from "vitest";
import {
  isDevelopment,
  parseHttpOrigin,
  readToken,
  requireEnv,
  resolveIndexable,
  resolveSiteUrl,
  resolveTrustedOrigins,
} from "./env";

describe("parseHttpOrigin", () => {
  it("keeps only the origin of http(s) urls", () => {
    expect(parseHttpOrigin(" https://exemplo.com.br/path?x=1 ")?.href).toBe(
      "https://exemplo.com.br/",
    );
  });

  it("rejects empty, invalid and non-http values", () => {
    expect(parseHttpOrigin(undefined)).toBeNull();
    expect(parseHttpOrigin("   ")).toBeNull();
    expect(parseHttpOrigin("not a url")).toBeNull();
    expect(parseHttpOrigin("ftp://exemplo.com")).toBeNull();
  });
});

describe("resolveSiteUrl", () => {
  it("prefers NEXT_PUBLIC_SITE_URL", () => {
    const url = resolveSiteUrl({
      NEXT_PUBLIC_SITE_URL: "https://assessoria.com.br",
      VERCEL_PROJECT_PRODUCTION_URL: "outro.vercel.app",
    });
    expect(url.href).toBe("https://assessoria.com.br/");
  });

  it("falls back to the Vercel production host", () => {
    const url = resolveSiteUrl({
      VERCEL_PROJECT_PRODUCTION_URL: "projeto.vercel.app",
    });
    expect(url.href).toBe("https://projeto.vercel.app/");
  });

  it("falls back to localhost when nothing valid is configured", () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "invalida" }).href).toBe(
      "http://localhost:3000/",
    );
  });
});

describe("resolveIndexable", () => {
  it("indexes only the Vercel production environment", () => {
    expect(resolveIndexable({ VERCEL_ENV: "production" })).toBe(true);
    expect(resolveIndexable({ VERCEL_ENV: "preview" })).toBe(false);
  });

  it("requires a production build and a valid site url outside Vercel", () => {
    expect(
      resolveIndexable({
        NODE_ENV: "production",
        NEXT_PUBLIC_SITE_URL: "https://assessoria.com.br",
      }),
    ).toBe(true);
    expect(resolveIndexable({ NODE_ENV: "production" })).toBe(false);
    expect(
      resolveIndexable({
        NODE_ENV: "development",
        NEXT_PUBLIC_SITE_URL: "https://assessoria.com.br",
      }),
    ).toBe(false);
  });
});

describe("isDevelopment", () => {
  it("is true only in development", () => {
    expect(isDevelopment({ NODE_ENV: "development" })).toBe(true);
    expect(isDevelopment({ NODE_ENV: "production" })).toBe(false);
    expect(isDevelopment({ NODE_ENV: "test" })).toBe(false);
    expect(isDevelopment({})).toBe(false);
  });
});

describe("readToken", () => {
  it("trims values and ignores blanks", () => {
    expect(readToken("  abc ")).toBe("abc");
    expect(readToken("  ")).toBeUndefined();
    expect(readToken(undefined)).toBeUndefined();
  });
});

describe("requireEnv", () => {
  it("returns the trimmed value", () => {
    expect(requireEnv({ SECRET: "  valor " }, "SECRET")).toBe("valor");
  });

  it("throws naming the missing variable", () => {
    expect(() => requireEnv({ SECRET: "   " }, "SECRET")).toThrow(/SECRET/);
    expect(() => requireEnv({}, "OUTRA")).toThrow(/OUTRA/);
  });
});

describe("resolveTrustedOrigins", () => {
  const siteUrl = new URL("https://assessoria.com.br/");

  it("includes the site origin and Vercel deployment hosts", () => {
    expect(
      resolveTrustedOrigins(
        {
          VERCEL_URL: "projeto-abc.vercel.app",
          VERCEL_BRANCH_URL: "projeto-git-main.vercel.app",
        },
        siteUrl,
      ),
    ).toEqual([
      "https://assessoria.com.br",
      "https://projeto-abc.vercel.app",
      "https://projeto-git-main.vercel.app",
    ]);
  });

  it("trusts localhost only in development", () => {
    expect(resolveTrustedOrigins({ NODE_ENV: "development" }, siteUrl)).toEqual(
      ["https://assessoria.com.br", "http://localhost:3000"],
    );
    expect(resolveTrustedOrigins({ NODE_ENV: "production" }, siteUrl)).toEqual([
      "https://assessoria.com.br",
    ]);
  });

  it("ignores blanks and removes duplicates", () => {
    expect(
      resolveTrustedOrigins(
        { VERCEL_URL: "assessoria.com.br", VERCEL_BRANCH_URL: "  " },
        siteUrl,
      ),
    ).toEqual(["https://assessoria.com.br"]);
  });
});
