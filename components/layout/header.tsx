import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { LanguageSwitcher } from "../ui/languageSwitch";
import { ThemeToggle } from "../ui/themeToggle";

export function Header() {
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-[var(--text)]"
        >
          dev<span className="text-[var(--color-accent)]">.</span>blog
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6">
          {[
            { href: "/blog", label: t("blog") },
            { href: "/tags", label: t("tags") },
            { href: "/about", label: t("about") },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-[var(--muted)] hover:text-[var(--text)] transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            aria-label="Search"
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--subtle)] text-[var(--muted)] hover:text-[var(--text)] transition-colors"
          >
            <Search size={16} />
          </button>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
