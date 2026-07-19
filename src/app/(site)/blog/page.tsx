import Link from "next/link";
import { getPosts } from "@/lib/store";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Blog",
  description:
    "Saç bakımı, renk trendleri ve randevu ipuçları — CELVA Atelier blog.",
  path: "/blog",
});

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <p className="text-xs uppercase tracking-[0.2em] text-bronze">Blog</p>
        <h1 className="font-display mt-3 text-4xl text-ink md:text-6xl">
          Notlar & trendler
        </h1>
        <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.cover}
                alt=""
                className="aspect-[16/10] w-full object-cover"
              />
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] uppercase tracking-wider text-sage"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <h2 className="font-display mt-2 text-2xl text-ink group-hover:text-sage-deep">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-ink-soft">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
