import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageSwitcher } from "@/components/ui/languageSwitch";

// Mock next/navigation
const mockPush = jest.fn();
const mockRefresh = jest.fn();
let mockPathname = "/en/blog";

jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockPathname = "/en/blog";
});

describe("LanguageSwitcher", () => {
  it("renders EN and ՀԱՅ buttons", () => {
    render(<LanguageSwitcher />);
    expect(screen.getByRole("button", { name: /switch to english/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /switch to armenian/i })).toBeInTheDocument();
  });

  it("highlights the current locale button", () => {
    mockPathname = "/en/blog";
    render(<LanguageSwitcher />);
    const enBtn = screen.getByRole("button", { name: /switch to english/i });
    // Active locale gets bg-accent class
    expect(enBtn.className).toContain("bg-accent");
  });

  it("does not navigate when clicking the already-active locale", () => {
    mockPathname = "/en";
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole("button", { name: /switch to english/i }));
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("navigates to /hy path when switching to Armenian", () => {
    mockPathname = "/en/blog";
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole("button", { name: /switch to armenian/i }));
    expect(mockPush).toHaveBeenCalledWith("/hy/blog");
  });

  it("navigates to /en path when switching from Armenian to English", () => {
    mockPathname = "/hy/about";
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole("button", { name: /switch to english/i }));
    expect(mockPush).toHaveBeenCalledWith("/en/about");
  });

  it("calls router.refresh after pushing", () => {
    mockPathname = "/en";
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole("button", { name: /switch to armenian/i }));
    expect(mockRefresh).toHaveBeenCalled();
  });
});
