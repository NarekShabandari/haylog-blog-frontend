"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    // Replace /en/ or /hy/ prefix in the URL
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
      <button
        onClick={() => switchLocale("en")}
        className={`px-3 py-1 rounded-md text-sm font-sans transition-colors ${
          locale === "en"
            ? "bg-gray-900 text-white"
            : "text-gray-500 hover:text-gray-900"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => switchLocale("hy")}
        className={`px-3 py-1 rounded-md text-sm font-armenian transition-colors ${
          locale === "hy"
            ? "bg-gray-900 text-white"
            : "text-gray-500 hover:text-gray-900"
        }`}
      >
        ՀԱՅ
      </button>
    </div>
  );
}
