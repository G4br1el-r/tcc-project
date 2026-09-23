import type { MetadataRoute } from "next";
import { buildRobots } from "@/lib/routes";
import { absoluteUrl, isIndexable } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return buildRobots(isIndexable, absoluteUrl("/sitemap.xml"));
}
