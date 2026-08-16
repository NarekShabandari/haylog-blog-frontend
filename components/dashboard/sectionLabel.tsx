export function SectionLabel({ label, flag }: { label: string; flag: string }) {
  return (
    <div className="flex items-center gap-2 pt-2">
      <span>{flag}</span>
      <span className="font-mono text-xs font-bold tracking-widest uppercase text-(--muted)">
        {label}
      </span>
      <div className="flex-1 h-px bg-(--border)" />
    </div>
  );
}
