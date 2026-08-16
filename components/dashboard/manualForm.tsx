import { useCreatePost } from "@/hooks/queries/useCreatePost";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  PenLine,
  Plus,
  X,
} from "lucide-react";
import { useState } from "react";
import { Field } from "../blog/field";
import { PublishedToggle } from "./publishedToggle";
import { SectionLabel } from "./sectionLabel";

const inputClass = `
  w-full px-3 py-2.5 rounded-lg border border-[var(--border)]
  bg-[var(--subtle)] text-[var(--text)] text-sm
  placeholder:text-[var(--muted)]
  focus:outline-none focus:border-[var(--color-accent)]
  transition-colors
`;

export function ManualForm() {
  const {
    mutate: create,
    isPending,
    isSuccess,
    isError,
    error,
  } = useCreatePost();

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [form, setForm] = useState({
    title: "",
    title_hy: "",
    content: "",
    content_hy: "",
    meta_description: "",
    meta_description_hy: "",
    published: true,
  });

  const set = (key: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) {
      setTags((prev) => [...prev, t]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) =>
    setTags((prev) => prev.filter((t) => t !== tag));

  const handleSubmit = () => {
    if (!form.title || !form.content) return;
    create({ ...form, tags });
  };

  return (
    <div className="space-y-5">
      {/* English */}
      <SectionLabel label="English" flag="🇬🇧" />
      <Field label="Title *">
        <input
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="My awesome post"
          className={inputClass}
        />
      </Field>
      <Field label="Content * (Markdown supported)">
        <textarea
          value={form.content}
          onChange={(e) => set("content", e.target.value)}
          placeholder="# Heading&#10;&#10;Your content here..."
          rows={8}
          className={`${inputClass} resize-y font-mono text-xs`}
        />
      </Field>
      <Field label="Meta Description">
        <input
          value={form.meta_description}
          onChange={(e) => set("meta_description", e.target.value)}
          placeholder="Short description for SEO"
          className={inputClass}
          maxLength={160}
        />
        <span className="font-mono text-[10px] text-(--muted) mt-1">
          {form.meta_description.length}/160
        </span>
      </Field>

      {/* Armenian */}
      <SectionLabel label="Armenian" flag="🇦🇲" />
      <Field label="Վերնագիր">
        <input
          value={form.title_hy}
          onChange={(e) => set("title_hy", e.target.value)}
          placeholder="Իմ հոդվածը"
          className={`${inputClass} font-armenian`}
          lang="hy"
        />
      </Field>
      <Field label="Բովանդակություն (Markdown)">
        <textarea
          value={form.content_hy}
          onChange={(e) => set("content_hy", e.target.value)}
          placeholder="# Վերնագիր&#10;&#10;Բովանդակություն..."
          rows={8}
          className={`${inputClass} resize-y font-mono text-xs`}
          lang="hy"
        />
      </Field>
      <Field label="Մետա նկարագրություն">
        <input
          value={form.meta_description_hy}
          onChange={(e) => set("meta_description_hy", e.target.value)}
          placeholder="Կարճ նկարագրություն SEO-ի համար"
          className={`${inputClass} font-armenian`}
          lang="hy"
          maxLength={160}
        />
        <span className="font-mono text-[10px] text-(--muted) mt-1">
          {form.meta_description_hy.length}/160
        </span>
      </Field>

      {/* Tags */}
      <Field label="Tags">
        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTag()}
            placeholder="nextjs, react, typescript..."
            className={`${inputClass} flex-1`}
          />
          <button
            onClick={addTag}
            className="px-3 py-2 rounded-lg border border-(--border) bg-(--subtle) text-(--muted) hover:text-(--text) transition-colors"
          >
            <Plus size={15} />
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 font-mono text-xs px-2.5 py-1 rounded-full bg-accent-tint text-accent-dark"
              >
                {tag}
                <button onClick={() => removeTag(tag)}>
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        )}
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
          Post created successfully!
        </div>
      )}
      {isError && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          <AlertCircle size={15} />
          {(error as any)?.response?.data?.message ?? "Failed to create post"}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isPending || !form.title || !form.content}
        className="w-full flex items-center justify-center gap-2
  py-3 rounded-lg bg-accent text-white
  text-sm font-semibold hover:bg-accent-dark
  transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            Publishing...
          </>
        ) : (
          <>
            <PenLine size={15} />
            Publish Post
          </>
        )}
      </button>
    </div>
  );
}
