import { render, screen } from "@testing-library/react";
import { Header } from "@/components/layout/header";

// next-intl: provide translations inline
jest.mock("next-intl", () => ({
  useTranslations: (ns: string) => (key: string) => {
    const dict: Record<string, Record<string, string>> = {
      nav: { blog: "Blog", about: "About", home: "Home", tags: "Tags" },
    };
    return dict[ns]?.[key] ?? key;
  },
}));

// next/link renders a plain <a> in tests
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...rest}>{children}</a>
  ),
}));

// Mock child UI components to keep Header tests focused
jest.mock("@/components/ui/languageSwitch", () => ({
  LanguageSwitcher: () => <div data-testid="language-switcher" />,
}));
jest.mock("@/components/ui/themeToggle", () => ({
  ThemeToggle: () => <div data-testid="theme-toggle" />,
}));

describe("Header", () => {
  it("renders the site logo text", () => {
    render(<Header />);
    expect(screen.getByText("Stack")).toBeInTheDocument();
    expect(screen.getByText("Call")).toBeInTheDocument();
  });

  it("renders nav links for Blog and About", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "Blog" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
  });

  it("Blog link points to /", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute("href", "/");
  });

  it("About link points to /about", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
  });

  it("renders the LanguageSwitcher", () => {
    render(<Header />);
    expect(screen.getByTestId("language-switcher")).toBeInTheDocument();
  });

  it("renders the ThemeToggle", () => {
    render(<Header />);
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
  });

  it("renders a <header> landmark", () => {
    render(<Header />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });
});
