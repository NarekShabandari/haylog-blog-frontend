import { ReactNode } from "react";

export function TabButton({
  active,
  onClick,
  icon,
  label,
  deactive,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
  deactive?: boolean;
}) {
  return (
    <button
      onClick={deactive ? undefined : onClick}
      className={`flex  items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${deactive ? "border-transparent text-muted/50 cursor-not-allowed" : active ? "border-accent text-accent cursor-pointer" : "border-transparent text-muted hover:text-text cursor-pointer"}`}
    >
      {icon}
      {label}
    </button>
  );
}
