import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";

interface ButtonProps extends DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> {
  children: ReactNode;
}

export default function Button({ children, ...rest }: ButtonProps) {
  return (
    <button
      className="hover:cursor-pointer w-full py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
      {...rest}
    >
      {children}
    </button>
  );
}
