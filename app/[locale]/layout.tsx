import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
