export function Footer() {
  return (
    <footer className="border-t border-(--border) bg-(--surface) mt-20">
      <div className="w-full mx-auto px-6 py-2 flex flex-col md:flex-row items-center justify-center gap-4">
        <span className="font-mono text-xs text-(--muted)">
          © {new Date().getFullYear()} Main Threat
        </span>
      </div>
    </footer>
  );
}
