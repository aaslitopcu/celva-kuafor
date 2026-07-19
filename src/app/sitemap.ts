import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/store";
import { siteConfig } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  const base = siteConfig.url;

  const staticPages = [
    "",
    "/hizmetler",
    "/randevu",
    "/galeri",
    "/stil-quiz",
    "/blog",
    "/iletisim",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const blogPages = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...blogPages];
}
