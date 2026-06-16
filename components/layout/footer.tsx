import { useTranslations } from "next-intl";
import Link from "next/link";

export function Footer() {
  const t = useTranslations("nav");

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] mt-20">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-mono text-xs text-[var(--muted)]">
          © {new Date().getFullYear()} dev.blog — built with Next.js
        </span>

        <div className="flex items-center gap-6">
          {[
            { href: "https://twitter.com", label: "Twitter" },
            { href: "https://github.com", label: "GitHub" },
            { href: "/rss.xml", label: "RSS" },
          ].map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className="text-sm font-medium text-[var(--muted)] hover:text-[var(--text)] transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
