import { Header } from "@/components/layout/header";
import { render, screen } from "@testing-library/react";

// next-intl: provide translations and locale inline
jest.mock("next-intl", () => ({
  useTranslations: (ns: string) => (key: string) => {
    const dict: Record<string, Record<string, string>> = {
      nav: { blog: "Blog", about: "About", home: "Home", tags: "Tags", login: "Login" },
    };
    return dict[ns]?.[key] ?? key;
  },
  useLocale: () => "en",
}));

// next/link renders a plain <a> in tests
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
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
  it("renders the site logo link", () => {
    render(<Header />);
    // Logo link accessible name is "hay . log" (dot is in a child <span>)
    const logoLink = screen.getByRole("link", { name: /hay/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute("href", "/en");
    expect(logoLink.textContent).toMatch(/hay.*log/);
  });

  it("renders nav links for Blog and About", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "Blog" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Login" })).toBeInTheDocument();
  });

  it("Blog link points to /", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("About link points to /about", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/about",
    );
  });

  it("About link points to /about", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "Login" })).toHaveAttribute(
      "href",
      "/login",
    );
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
