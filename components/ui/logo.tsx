import { useLocale } from "next-intl";
import Link from "next/link";

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
  const locale = useLocale();

  return (
    <div className={"text-center " + className}>
      <Link
        href={`/${locale}`}
        className="text-2xl font-bold tracking-tight text-(--text)"
      >
        hay<span className="text-accent">.</span>log
      </Link>
    </div>
  );
}
