import { Eye, EyeOff } from "lucide-react";
import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  MouseEventHandler,
  ReactNode,
} from "react";

interface InputProps extends DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> {
  icon?: ReactNode;
  label?: string;
  hasVisibilityToggle?: boolean;
  visible?: boolean;
  onVisibilityClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function Input({
  icon,
  label,
  hasVisibilityToggle = false,
  visible = false,
  onVisibilityClick,
  ...rest
}: InputProps) {
  return (
    <div>
      {label && (
        <label className="block font-mono text-[11px] font-bold tracking-widest uppercase text-(--muted) mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon}
        <input
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-(--border) bg-(--subtle) text-(--text) text-sm placeholder:text-(--muted) focus:outline-none focus:border-accent transition-colors"
          {...rest}
        />
        {hasVisibilityToggle && (
          <button
            type="button"
            onClick={onVisibilityClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-(--muted) hover:text-(--text) transition-colors hover:cursor-pointer"
          >
            {visible ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  );
}
