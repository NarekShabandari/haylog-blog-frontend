import { useGeneratePost } from "@/hooks/queries/useGeneratePost";
import { AlertCircle, CheckCircle, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { Field } from "../blog/field";
import { PublishedToggle } from "./publishedToggle";

const inputClass = `
  w-full px-3 py-2.5 rounded-lg border border-[var(--border)]
  bg-[var(--subtle)] text-[var(--text)] text-sm
  placeholder:text-[var(--muted)]
  focus:outline-none focus:border-[var(--color-accent)]
  transition-colors
`;

export function GenerateForm() {
  const {
    mutate: generate,
    isPending,
    isSuccess,
    isError,
    error,
  } = useGeneratePost();

  const [form, setForm] = useState({
    topic: "",
    targetKeyword: "",
    audience: "Web developers",
    tone: "technical but approachable",
    published: true,
  });

  const set = (key: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    if (!form.topic || !form.targetKeyword) return;
    generate(form);
  };

  return (
    <div className="space-y-5">
      <div className="p-4 rounded-xl bg-accent-tint border border-accent/20">
        <div className="flex items-center gap-2 text-accent-dark">
          <Sparkles size={15} />
          <p className="text-sm font-medium">
            AI will generate title, content, slug, and meta in both EN and HY
          </p>
        </div>
      </div>

      {/* Topic */}
      <Field label="Topic *">
        <input
          value={form.topic}
          onChange={(e) => set("topic", e.target.value)}
          placeholder="Core Web Vitals Blueprint"
          className={inputClass}
        />
      </Field>

      {/* Target keyword */}
      <Field label="Target Keyword *">
        <input
          value={form.targetKeyword}
          onChange={(e) => set("targetKeyword", e.target.value)}
          placeholder="Core Web Vitals"
          className={inputClass}
        />
      </Field>

      {/* Audience */}
      <Field label="Audience">
        <input
          value={form.audience}
          onChange={(e) => set("audience", e.target.value)}
          placeholder="Web developers"
          className={inputClass}
        />
      </Field>

      {/* Tone */}
      <Field label="Tone">
        <select
          value={form.tone}
          onChange={(e) => set("tone", e.target.value)}
          className={inputClass}
        >
          <option value="technical but approachable">
            Technical but approachable
          </option>
          <option value="casual and friendly">Casual and friendly</option>
          <option value="formal and professional">
            Formal and professional
          </option>
          <option value="beginner friendly">Beginner friendly</option>
        </select>
      </Field>

      {/* Published toggle */}
      <PublishedToggle
        value={form.published}
        onChange={(v) => set("published", v)}
      />

      {/* Feedback */}
      {isSuccess && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
          <CheckCircle size={15} />
          Post generated successfully!
        </div>
      )}
      {isError && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          <AlertCircle size={15} />
          {(error as any)?.response?.data?.message ?? "Failed to generate post"}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isPending || !form.topic || !form.targetKeyword}
        className="w-full flex items-center justify-center gap-2
  py-3 rounded-lg bg-accent text-white
  text-sm font-semibold hover:bg-accent-dark
  transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            Generating... (this may take 30s)
          </>
        ) : (
          <>
            <Sparkles size={15} />
            Generate Post
          </>
        )}
      </button>
    </div>
  );
}
