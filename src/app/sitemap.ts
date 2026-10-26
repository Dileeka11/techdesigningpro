import type { MetadataRoute } from "next";
import { site, servicesNav } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/about-us/", "/services/", ...servicesNav.map((s) => s.href), "/gallery/", "/our-clients/", "/projects/", "/contact-us/"];
  return paths.map((p) => ({
    url: `${site.url}${p}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: p === "/" ? 1 : 0.8,
  }));
}
