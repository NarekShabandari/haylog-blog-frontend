import { ReactNode } from "react";

export function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${active ? "border-accent text-accent" : "border-transparent text-muted hover:text-text"}`}
    >
      {icon}
      {label}
    </button>
  );
}
