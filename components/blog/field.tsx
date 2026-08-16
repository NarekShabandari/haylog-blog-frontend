export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-mono text-[11px] font-bold tracking-widest uppercase text-(--muted)">
        {label}
      </label>
      {children}
    </div>
  );
}
