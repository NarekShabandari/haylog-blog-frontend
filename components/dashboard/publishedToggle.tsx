export function PublishedToggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-(--border)">
      <div>
        <p className="text-sm font-medium text-(--text)">Publish immediately</p>
        <p className="text-xs text-(--muted)">
          {value
            ? "Post will be visible to readers"
            : "Post will be saved as draft"}
        </p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full transition-colors relative ${
          value ? "bg-accent" : "bg-(--border)"
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            value ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
