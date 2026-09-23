import type { MetadataRoute } from "next";
import { buildSitemap, PUBLIC_ROUTES } from "@/lib/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap(PUBLIC_ROUTES);
}
