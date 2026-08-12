import { Header } from "@/components/layout/header";
import { render, screen } from "@testing-library/react";

// ─── Mocks ───────────────────────────────────────────────────────────────────

// Control isLoggedIn per test via this variable
let mockIsLoggedIn = false;

jest.mock("@/hooks/queries/useAuth", () => ({
  useAuth: () => ({ isLoggedIn: mockIsLoggedIn }),
}));

jest.mock("next-intl", () => ({
  useTranslations: (ns: string) => (key: string) => {
    const dict: Record<string, Record<string, string>> = {
      nav: { blog: "Blog", about: "About", home: "Home", tags: "Tags", login: "Login" },
    };
    return dict[ns]?.[key] ?? key;
  },
  useLocale: () => "en",
}));

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

jest.mock("@/components/ui/languageSwitch", () => ({
  LanguageSwitcher: () => <div data-testid="language-switcher" />,
}));
jest.mock("@/components/ui/themeToggle", () => ({
  ThemeToggle: () => <div data-testid="theme-toggle" />,
}));

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("Header — unauthenticated (isLoggedIn = false)", () => {
  beforeEach(() => {
    mockIsLoggedIn = false;
  });

  it("renders a <header> landmark", () => {
    render(<Header />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders the site logo link", () => {
    render(<Header />);
    const logoLink = screen.getByRole("link", { name: /hay/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute("href", "/en");
    expect(logoLink.textContent).toMatch(/hay.*log/);
  });

  it("renders the Blog nav link", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "Blog" })).toBeInTheDocument();
  });

  it("Blog link points to /", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute("href", "/");
  });

  it("renders the About nav link", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
  });

  it("About link points to /about", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
  });

  it("renders the Login nav link when logged out", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "Login" })).toBeInTheDocument();
  });

  it("Login link points to /login", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "Login" })).toHaveAttribute("href", "/login");
  });

  it("renders the LanguageSwitcher", () => {
    render(<Header />);
    expect(screen.getByTestId("language-switcher")).toBeInTheDocument();
  });

  it("renders the ThemeToggle", () => {
    render(<Header />);
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
  });
});

describe("Header — authenticated (isLoggedIn = true)", () => {
  beforeEach(() => {
    mockIsLoggedIn = true;
  });

  it("renders a <header> landmark", () => {
    render(<Header />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("still renders the Blog nav link", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "Blog" })).toBeInTheDocument();
  });

  it("still renders the About nav link", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
  });

  it("hides the Login nav link when logged in", () => {
    render(<Header />);
    expect(screen.queryByRole("link", { name: "Login" })).not.toBeInTheDocument();
  });

  it("still renders the LanguageSwitcher", () => {
    render(<Header />);
    expect(screen.getByTestId("language-switcher")).toBeInTheDocument();
  });

  it("still renders the ThemeToggle", () => {
    render(<Header />);
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
  });
});
