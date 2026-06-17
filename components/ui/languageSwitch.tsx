"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

const LOCALES = ["en", "hy"] as const;
type Locale = (typeof LOCALES)[number];

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const currentLocale =
    LOCALES.find((l) => pathname.startsWith(`/${l}`)) ?? "en";

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;

    const newPath = `/${newLocale}${pathname.slice(currentLocale.length + 1)}`;

    startTransition(() => {
      router.push(newPath);
      router.refresh();
    });
  };

  return (
    <div
      className="flex rounded-lg overflow-hidden border border-(--border)"
      style={{ opacity: isPending ? 0.6 : 1, transition: "opacity 0.15s" }}
    >
      {LOCALES.map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          disabled={isPending}
          aria-label={`Switch to ${l === "en" ? "English" : "Armenian"}`}
          className={`px-3 h-8 py-1 text-xs font-mono font-bold transition-colors cursor-pointer ${
            currentLocale === l
              ? "bg-accent text-white"
              : "bg-(--subtle) text-(--muted) hover:text-(--text)"
          }`}
        >
          {l === "en" ? "EN" : "ՀԱՅ"}
        </button>
      ))}
    </div>
  );
}
