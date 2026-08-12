import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "@/app/[locale]/login/page";

// ─── Mocks ───────────────────────────────────────────────────────────────────

// Control mutation state per test
let mockIsPending = false;
let mockIsError = false;
let mockError: unknown = null;
const mockMutate = jest.fn();

jest.mock("@/hooks/queries/useLogin", () => ({
  useLogin: () => ({
    mutate: mockMutate,
    isPending: mockIsPending,
    isError: mockIsError,
    error: mockError,
  }),
}));

jest.mock("next-intl", () => ({
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resetMockState() {
  mockIsPending = false;
  mockIsError = false;
  mockError = null;
  mockMutate.mockClear();
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("LoginPage — static rendering", () => {
  beforeEach(resetMockState);

  it("renders the Sign in heading", () => {
    render(<LoginPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Sign in" })
    ).toBeInTheDocument();
  });

  it("renders the email input with correct type", () => {
    render(<LoginPage />);
    const emailInput = screen.getByPlaceholderText("you@example.com");
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("type", "email");
  });

  it("renders the Email label", () => {
    render(<LoginPage />);
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("renders the password input with correct type", () => {
    render(<LoginPage />);
    const passwordInput = screen.getByPlaceholderText("••••••••");
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("renders the Password label", () => {
    render(<LoginPage />);
    expect(screen.getByText("Password")).toBeInTheDocument();
  });

  it("renders the Sign in submit button", () => {
    render(<LoginPage />);
    expect(
      screen.getByRole("button", { name: "Sign in" })
    ).toBeInTheDocument();
  });

  it("renders the logo", () => {
    render(<LoginPage />);
    expect(screen.getByRole("link", { name: /hay.*log/i })).toBeInTheDocument();
  });

  it("renders the back to blog link pointing to /en", () => {
    render(<LoginPage />);
    const backLink = screen.getByRole("link", { name: /back to blog/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/en");
  });

  it("does not show the error banner initially", () => {
    render(<LoginPage />);
    expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument();
  });
});

describe("LoginPage — submit button disabled state", () => {
  beforeEach(resetMockState);

  it("is disabled when both fields are empty", () => {
    render(<LoginPage />);
    expect(screen.getByRole("button", { name: "Sign in" })).toBeDisabled();
  });

  it("is disabled when only email is filled", async () => {
    render(<LoginPage />);
    await userEvent.type(
      screen.getByPlaceholderText("you@example.com"),
      "user@example.com"
    );
    expect(screen.getByRole("button", { name: "Sign in" })).toBeDisabled();
  });

  it("is disabled when only password is filled", async () => {
    render(<LoginPage />);
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "secret");
    expect(screen.getByRole("button", { name: "Sign in" })).toBeDisabled();
  });

  it("is enabled when both email and password are filled", async () => {
    render(<LoginPage />);
    await userEvent.type(
      screen.getByPlaceholderText("you@example.com"),
      "user@example.com"
    );
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "secret");
    expect(screen.getByRole("button", { name: "Sign in" })).toBeEnabled();
  });
});

describe("LoginPage — controlled inputs", () => {
  beforeEach(resetMockState);

  it("updates the email field as the user types", async () => {
    render(<LoginPage />);
    const emailInput = screen.getByPlaceholderText("you@example.com");
    await userEvent.type(emailInput, "alice@example.com");
    expect(emailInput).toHaveValue("alice@example.com");
  });

  it("updates the password field as the user types", async () => {
    render(<LoginPage />);
    const passwordInput = screen.getByPlaceholderText("••••••••");
    await userEvent.type(passwordInput, "hunter2");
    expect(passwordInput).toHaveValue("hunter2");
  });
});

describe("LoginPage — password visibility toggle", () => {
  beforeEach(resetMockState);

  it("password input starts as type=password", () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText("••••••••")).toHaveAttribute(
      "type",
      "password"
    );
  });

  it("clicking the toggle shows the password (type=text)", async () => {
    render(<LoginPage />);
    const toggleBtn = screen.getByRole("button", { name: "" }); // eye icon, no text label
    await userEvent.click(toggleBtn);
    expect(screen.getByPlaceholderText("••••••••")).toHaveAttribute(
      "type",
      "text"
    );
  });

  it("clicking the toggle a second time hides the password again", async () => {
    render(<LoginPage />);
    const toggleBtn = screen.getByRole("button", { name: "" });
    await userEvent.click(toggleBtn);
    await userEvent.click(toggleBtn);
    expect(screen.getByPlaceholderText("••••••••")).toHaveAttribute(
      "type",
      "password"
    );
  });
});

describe("LoginPage — form submission", () => {
  beforeEach(resetMockState);

  it("calls login mutate with email and password on submit", async () => {
    render(<LoginPage />);
    await userEvent.type(
      screen.getByPlaceholderText("you@example.com"),
      "alice@example.com"
    );
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "secret123");
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(mockMutate).toHaveBeenCalledWith({
      email: "alice@example.com",
      password: "secret123",
    });
  });

  it("calls mutate exactly once per submit", async () => {
    render(<LoginPage />);
    await userEvent.type(
      screen.getByPlaceholderText("you@example.com"),
      "alice@example.com"
    );
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "secret123");
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(mockMutate).toHaveBeenCalledTimes(1);
  });
});

describe("LoginPage — pending state", () => {
  beforeEach(() => {
    resetMockState();
    mockIsPending = true;
  });

  it("shows 'Signing in...' text while pending", () => {
    render(<LoginPage />);
    expect(screen.getByText(/signing in/i)).toBeInTheDocument();
  });

  it("the submit button is disabled while pending", () => {
    render(<LoginPage />);
    // Button is disabled when isPending is true
    const btn = screen.getByRole("button", { name: /signing in/i });
    expect(btn).toBeDisabled();
  });
});

describe("LoginPage — error state", () => {
  beforeEach(() => {
    resetMockState();
    mockIsError = true;
  });

  it("shows the error banner when isError is true", () => {
    render(<LoginPage />);
    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });

  it("shows a custom error message from the API response", () => {
    mockError = { response: { data: { message: "Account is locked" } } };
    render(<LoginPage />);
    expect(screen.getByText("Account is locked")).toBeInTheDocument();
  });

  it("falls back to 'Invalid credentials' when error has no response body", () => {
    mockError = new Error("Network Error");
    render(<LoginPage />);
    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });
});
