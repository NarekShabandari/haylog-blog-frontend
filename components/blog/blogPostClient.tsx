"use client";

import { usePost } from "@/hooks/queries/usePosts";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MainSection } from "../layout/mainSection";

interface Props {
  slug: string;
  locale: string;
}

export function BlogPostClient({ slug, locale }: Props) {
  const { data: post, isLoading, isError } = usePost(slug);

  if (isLoading) return <PostSkeleton />;
  if (isError || !post) return notFound();

  const isHy = locale === "hy";
  const title = isHy ? post.title_hy : post.title;
  const content = isHy ? post.content_hy : post.content;

  return (
    <MainSection narrow>
      <article>
        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-accent-tint text-accent-dark"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl font-bold tracking-tight text-(--text) leading-tight mb-4">
          {title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-(--border)">
          <div className="w-9 h-9 rounded-full bg-accent-tint flex items-center justify-center font-bold text-sm text-accent">
            {post.author?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-(--text)">{post.author}</p>
            <p className="font-mono text-xs text-(--muted)">
              {new Date(post.created_at).toLocaleDateString(
                isHy ? "hy-AM" : "en-US",
                { year: "numeric", month: "long", day: "numeric" },
              )}
              {post.updated_at !== post.created_at && (
                <span className="ml-2 opacity-60">
                  · updated {new Date(post.updated_at).toLocaleDateString()}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Cover image */}
        {post.cover_image && (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-10">
            <Image
              src={post.cover_image}
              alt={title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg max-w-none
            prose-headings:font-sans prose-headings:tracking-tight prose-headings:text-(--text)
            prose-p:text-(--muted) prose-p:leading-relaxed
            prose-a:text-accent prose-a:no-underline hover:prose-a:underline
            prose-code:font-mono prose-code:text-accent
            prose-pre:bg-(--subtle) prose-pre:border prose-pre:border-(--border)
            prose-img:rounded-xl prose-img:border prose-img:border-(--border)
            prose-strong:text-(--text)
            dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>
    </MainSection>
  );
}

function PostSkeleton() {
  return (
    <MainSection narrow>
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-24 bg-(--subtle) rounded-full" />
        <div className="h-10 w-3/4 bg-(--subtle) rounded-lg" />
        <div className="h-4 w-1/3 bg-(--subtle) rounded-lg" />
        <div className="h-64 w-full bg-(--subtle) rounded-xl" />
        <div className="space-y-3 pt-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-4 bg-(--subtle) rounded"
              style={{ width: `${90 - i * 5}%` }}
            />
          ))}
        </div>
      </div>
    </MainSection>
  );
}
