import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getPosts } from "@/lib/store";
import { createMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return createMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.cover,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const paragraphs = post.content.split("\n\n");

  return (
    <article className="pt-24">
      <div className="mx-auto max-w-3xl px-5 py-12 md:px-8">
        <Link href="/blog" className="text-xs text-sage-deep hover:underline">
          ← Blog
        </Link>
        <p className="mt-6 text-xs text-ink-soft">
          {new Date(post.publishedAt).toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <h1 className="font-display mt-3 text-4xl text-ink md:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-base text-ink-soft">{post.excerpt}</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.cover}
          alt=""
          className="mt-8 aspect-[16/9] w-full object-cover"
        />
        <div className="prose-celva mt-10">
          {paragraphs.map((block, i) => {
            if (block.startsWith("## ")) {
              return <h2 key={i}>{block.replace("## ", "")}</h2>;
            }
            if (block.startsWith("- ")) {
              const items = block.split("\n").filter(Boolean);
              return (
                <ul key={i}>
                  {items.map((item) => (
                    <li key={item}>{item.replace(/^- /, "")}</li>
                  ))}
                </ul>
              );
            }
            return <p key={i}>{block}</p>;
          })}
        </div>
        <div className="mt-12 border-t border-line pt-8">
          <Link
            href="/randevu"
            className="inline-flex bg-ink px-5 py-3 text-sm text-paper hover:bg-ink-soft"
          >
            Randevu al
          </Link>
        </div>
      </div>
    </article>
  );
}
