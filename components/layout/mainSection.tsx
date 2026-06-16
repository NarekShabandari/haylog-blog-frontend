interface MainSectionProps {
  children: React.ReactNode;
  className?: string;
  narrow?: boolean; // for single post pages
}

export function MainSection({
  children,
  className = "",
  narrow = false,
}: MainSectionProps) {
  return (
    <main
      className={`
        w-full mx-auto px-4 sm:px-6 py-12
        ${narrow ? "max-w-3xl" : "max-w-6xl"}
        ${className}
      `}
    >
      {children}
    </main>
  );
}
