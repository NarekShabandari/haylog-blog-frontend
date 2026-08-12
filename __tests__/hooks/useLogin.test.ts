import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useLogin } from "@/hooks/queries/useLogin";

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock("@/lib/axios", () => ({
  apiClient: { post: jest.fn() },
}));

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("next-intl", () => ({
  useLocale: () => "en",
}));

import { apiClient } from "@/lib/axios";
const mockPost = apiClient.post as jest.Mock;

// ─── Test helpers ─────────────────────────────────────────────────────────────

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return {
    wrapper: function Wrapper({ children }: { children: React.ReactNode }) {
      return React.createElement(
        QueryClientProvider,
        { client: queryClient },
        children
      );
    },
    queryClient,
  };
}

const credentials = { email: "alice@example.com", password: "secret123" };
const mockUser = { id: "u1", name: "Alice", email: "alice@example.com" };
const mockResponse = { user: mockUser, token: "jwt-token" };

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("useLogin — initial state", () => {
  it("is not pending before mutate is called", () => {
    const { wrapper } = makeWrapper();
    const { result } = renderHook(() => useLogin(), { wrapper });
    expect(result.current.isPending).toBe(false);
  });

  it("exposes a mutate function", () => {
    const { wrapper } = makeWrapper();
    const { result } = renderHook(() => useLogin(), { wrapper });
    expect(typeof result.current.mutate).toBe("function");
  });
});

describe("useLogin — successful login", () => {
  beforeEach(() => {
    mockPost.mockClear();
    mockPush.mockClear();
  });

  it("calls POST /auth/login with the provided credentials", async () => {
    mockPost.mockResolvedValueOnce({ data: mockResponse });
    const { wrapper } = makeWrapper();
    const { result } = renderHook(() => useLogin(), { wrapper });

    act(() => result.current.mutate(credentials));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockPost).toHaveBeenCalledWith("/auth/login", credentials);
  });

  it("navigates to the locale home on success", async () => {
    mockPost.mockResolvedValueOnce({ data: mockResponse });
    const { wrapper } = makeWrapper();
    const { result } = renderHook(() => useLogin(), { wrapper });

    act(() => result.current.mutate(credentials));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockPush).toHaveBeenCalledWith("/en/");
  });

  it("updates the [auth, me] query cache with the returned user", async () => {
    mockPost.mockResolvedValueOnce({ data: mockResponse });
    const { wrapper, queryClient } = makeWrapper();

    // setQueriesData (v5) only updates existing cache entries — seed it first
    queryClient.setQueryData(["auth", "me"], null);

    const { result } = renderHook(() => useLogin(), { wrapper });

    act(() => result.current.mutate(credentials));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // The hook calls queryClient.setQueriesData(["auth", "me"], data.user)
    const cached = queryClient.getQueryData(["auth", "me"]);
    expect(cached).toEqual(mockUser);
  });

  it("is not in an error state after a successful mutation", async () => {
    mockPost.mockResolvedValueOnce({ data: mockResponse });
    const { wrapper } = makeWrapper();
    const { result } = renderHook(() => useLogin(), { wrapper });

    act(() => result.current.mutate(credentials));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.isError).toBe(false);
  });
});

describe("useLogin — failed login", () => {
  beforeEach(() => {
    mockPost.mockClear();
    mockPush.mockClear();
  });

  it("sets isError on API failure", async () => {
    mockPost.mockRejectedValueOnce(new Error("Invalid credentials"));
    const { wrapper } = makeWrapper();
    const { result } = renderHook(() => useLogin(), { wrapper });

    act(() => result.current.mutate(credentials));
    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("exposes the error object on failure", async () => {
    const apiError = new Error("Invalid credentials");
    mockPost.mockRejectedValueOnce(apiError);
    const { wrapper } = makeWrapper();
    const { result } = renderHook(() => useLogin(), { wrapper });

    act(() => result.current.mutate(credentials));
    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeTruthy();
  });

  it("does not navigate on failure", async () => {
    mockPost.mockRejectedValueOnce(new Error("Invalid credentials"));
    const { wrapper } = makeWrapper();
    const { result } = renderHook(() => useLogin(), { wrapper });

    act(() => result.current.mutate(credentials));
    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(mockPush).not.toHaveBeenCalled();
  });

  it("does not update the query cache on failure", async () => {
    mockPost.mockRejectedValueOnce(new Error("Invalid credentials"));
    const { wrapper, queryClient } = makeWrapper();
    const { result } = renderHook(() => useLogin(), { wrapper });

    act(() => result.current.mutate(credentials));
    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(queryClient.getQueryData(["auth", "me"])).toBeUndefined();
  });
});
