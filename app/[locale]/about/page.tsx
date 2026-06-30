import { MainSection } from "@/components/layout/mainSection";
import { Info, Mail } from "lucide-react";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how this blog is written, using AI assistance with human review.",
};

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <MainSection narrow>
      <div className="max-w-2xl mx-auto">
        {/* Tag */}
        <span className="inline-block font-mono text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-[var(--color-accent-tint)] text-[var(--color-accent-dark)] mb-4">
          {t("tag")}
        </span>

        {/* Title */}
        <h1 className="text-3xl font-bold tracking-tight text-(--text) mb-3">
          {t("title")}
        </h1>

        {/* Lede */}
        <p className="text-base leading-relaxed text-(--muted) mb-8">
          {t("lede")}
        </p>

        {/* Transparency notice */}
        <div className="flex gap-3 p-4 rounded-xl border border-[var(--color-accent-dark)] mb-8">
          <Info
            size={20}
            className="text-[var(--color-accent-dark)] shrink-0 mt-0.5"
          />
          <div>
            <p className="text-sm font-semibold text-[var(--color-accent-dark)] mb-1">
              {t("noticeTitle")}
            </p>
            <p className="text-sm leading-relaxed text-[var(--color-accent-dark)]">
              {t("noticeBody")}
            </p>
          </div>
        </div>

        {/* Why AI-assisted */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-(--text) mb-2">
            {t("whyTitle")}
          </h2>
          <p className="text-sm leading-relaxed text-(--muted)">
            {t("whyBody")}
          </p>
        </section>

        {/* Process steps */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-(--text) mb-3">
            {t("processTitle")}
          </h2>
          <div className="flex flex-col gap-2.5">
            {["step1", "step2", "step3"].map((key, i) => (
              <div
                key={key}
                className="flex gap-3 items-start p-3.5 rounded-lg border border-(--border)"
              >
                <span className="font-mono text-xs font-bold text-(--muted) min-w-4.5">
                  0{i + 1}
                </span>
                <p className="text-sm text-(--muted) leading-relaxed">
                  {t(key)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Found an error */}
        <section className="flex items-start gap-3 pt-6 border-t border-(--border)">
          <Mail size={18} className="text-(--muted) shrink-0 mt-0.5" />
          <div>
            <h2 className="text-sm font-semibold text-(--text) mb-1">
              {t("errorTitle")}
            </h2>
            <p className="text-sm leading-relaxed text-(--muted)">
              {t("errorBody")}
            </p>
          </div>
        </section>
      </div>
    </MainSection>
  );
}
