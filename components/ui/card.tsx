import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
}

export default function Card({ children }: CardProps) {
  return (
    <div className="bg-(--surface) border border-(--border) rounded-2xl p-8 ">
      {children}
    </div>
  );
}
