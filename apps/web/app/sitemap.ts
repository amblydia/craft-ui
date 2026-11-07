import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/shared";
import { source } from "@/lib/source";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl },
    { url: `${siteUrl}/blocks` },
    { url: `${siteUrl}/sponsors` },
    ...source.getPages().map((page) => ({ url: `${siteUrl}${page.url}` })),
  ];
}
