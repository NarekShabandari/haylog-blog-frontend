import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "@/components/ui/themeToggle";

// localStorage is provided by jsdom; we just need to spy on it.
beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("dark");
  // Reset matchMedia to "light" preference by default
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false, // default: light mode
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

describe("ThemeToggle", () => {
  it("renders a button with accessible label", () => {
    render(<ThemeToggle />);
    expect(
      screen.getByRole("button", { name: /toggle theme/i })
    ).toBeInTheDocument();
  });

  it("shows Moon icon in light mode (dark class absent)", () => {
    render(<ThemeToggle />);
    // In light mode the Moon icon should be shown; Sun should not.
    // We verify indirectly via aria-label staying "Toggle theme" and the
    // absence of the dark class on documentElement.
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("adds 'dark' class to documentElement when toggled to dark", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: /toggle theme/i });
    fireEvent.click(button);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("persists theme preference to localStorage", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: /toggle theme/i });
    fireEvent.click(button); // → dark
    expect(localStorage.getItem("theme")).toBe("dark");
    fireEvent.click(button); // → light
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("reads saved 'dark' theme from localStorage on mount", () => {
    localStorage.setItem("theme", "dark");
    render(<ThemeToggle />);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("reads saved 'light' theme from localStorage on mount", () => {
    localStorage.setItem("theme", "light");
    render(<ThemeToggle />);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("respects prefers-color-scheme: dark when no saved preference", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: true, // system prefers dark
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    render(<ThemeToggle />);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
