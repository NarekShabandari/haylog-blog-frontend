import Image from "next/image";
import Link from "next/link";

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  readTime: number;
  date: string;
}

export function BlogCard({
  slug,
  title,
  excerpt,
  coverImage,
  category,
  readTime,
  date,
}: BlogCardProps) {
  return (
    <Link href={`/blog/${slug}`} className="group block">
      <article className="h-full rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden hover:border-[var(--color-accent)] transition-colors duration-200">
        {/* Cover image */}
        <div className="relative aspect-video overflow-hidden bg-[var(--subtle)]">
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Category tag */}
          <span className="font-mono text-[10px] font-bold tracking-widest text-[var(--color-accent)] uppercase">
            {category}
          </span>

          {/* Title */}
          <h2 className="mt-2 text-base font-semibold leading-snug text-[var(--text)] group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
            {title}
          </h2>

          {/* Excerpt */}
          <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed line-clamp-2">
            {excerpt}
          </p>

          {/* Meta */}
          <div className="mt-4 flex items-center justify-between">
            <time className="font-mono text-[11px] text-[var(--muted)]">
              {new Date(date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            <span className="font-mono text-[11px] text-[var(--muted)]">
              {readTime} min read
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
