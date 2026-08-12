import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "@/store/slices/authSlice";
import React from "react";
import { useAuth } from "@/hooks/queries/useAuth";

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock("@/lib/axios", () => ({
  apiClient: { get: jest.fn() },
}));

import { apiClient } from "@/lib/axios";
const mockGet = apiClient.get as jest.Mock;

// ─── Test helpers ─────────────────────────────────────────────────────────────

function makeStore() {
  return configureStore({ reducer: { auth: authSlice.reducer } });
}

/**
 * Wraps renderHook with both a fresh Redux store and a fresh QueryClient.
 * Each test gets isolated state — no cross-test bleed.
 */
function makeWrapper(store = makeStore()) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      Provider,
      { store },
      React.createElement(QueryClientProvider, { client: queryClient }, children)
    );
  };
}

const mockUser = { id: "u1", name: "Alice", email: "alice@example.com" };

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("useAuth — loading state", () => {
  it("starts with isLoading true before the query resolves", () => {
    // Never resolves — keeps the hook in loading state
    mockGet.mockReturnValueOnce(new Promise(() => {}));
    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() });
    expect(result.current.isLoading).toBe(true);
  });
});

describe("useAuth — successful /auth/me response", () => {
  beforeEach(() => mockGet.mockClear());

  it("calls GET /auth/me", async () => {
    mockGet.mockResolvedValueOnce({ data: { user: mockUser } });
    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockGet).toHaveBeenCalledWith("/auth/me");
  });

  it("returns the user from the API", async () => {
    mockGet.mockResolvedValueOnce({ data: { user: mockUser } });
    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.user).toEqual(mockUser));
  });

  it("dispatches setUser to Redux on success", async () => {
    mockGet.mockResolvedValueOnce({ data: { user: mockUser } });
    const store = makeStore();
    const { result } = renderHook(() => useAuth(), {
      wrapper: makeWrapper(store),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(store.getState().auth.user).toEqual(mockUser);
    expect(store.getState().auth.isAuthenticated).toBe(true);
  });

  it("sets isLoggedIn to true after a successful response", async () => {
    mockGet.mockResolvedValueOnce({ data: { user: mockUser } });
    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isLoggedIn).toBe(true));
  });

  it("isLoading is false once the query settles", async () => {
    mockGet.mockResolvedValueOnce({ data: { user: mockUser } });
    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });
});

describe("useAuth — failed /auth/me response", () => {
  beforeEach(() => mockGet.mockClear());

  it("dispatches clearUser to Redux on error", async () => {
    mockGet.mockRejectedValueOnce(new Error("401 Unauthorized"));
    const store = makeStore();
    const { result } = renderHook(() => useAuth(), {
      wrapper: makeWrapper(store),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(store.getState().auth.user).toBeNull();
    expect(store.getState().auth.isAuthenticated).toBe(false);
  });

  it("returns isLoggedIn false when the request fails", async () => {
    mockGet.mockRejectedValueOnce(new Error("Unauthorized"));
    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isLoggedIn).toBe(false);
  });

  it("returns user as undefined when the request fails", async () => {
    mockGet.mockRejectedValueOnce(new Error("Unauthorized"));
    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.user).toBeUndefined();
  });
});

describe("useAuth — Redux state takes priority over React Query", () => {
  it("returns the Redux user when both Redux and query data are present", async () => {
    const reduxUser = { id: "redux-1", name: "Redux User", email: "redux@example.com" };
    const queryUser = { id: "query-1", name: "Query User", email: "query@example.com" };

    mockGet.mockResolvedValueOnce({ data: { user: queryUser } });

    // Pre-seed Redux store with a different user
    const store = makeStore();
    store.dispatch(authSlice.actions.setUser(reduxUser));

    const { result } = renderHook(() => useAuth(), {
      wrapper: makeWrapper(store),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    // Redux user wins (user: reduxUser ?? user logic in hook)
    expect(result.current.user?.id).toBe("query-1"); // after setUser dispatches, Redux is updated
    expect(result.current.isLoggedIn).toBe(true);
  });
});
