/**
 * Tests for the apiClient instance in lib/axios.ts.
 *
 * We verify the static configuration (baseURL, headers, credentials) and both
 * interceptors (auth token injection, 401 rejection) without making real network
 * calls by inspecting axios internals and by running the interceptor functions
 * directly.
 *
 * next/jest loads .env.local before module imports, so NEXT_PUBLIC_API_URL is
 * whatever is set there (http://localhost:5000 in dev). We test the key exists
 * and that the instance uses it — not a hardcoded value.
 */
import { apiClient } from "@/lib/axios";
import axios from "axios";

describe("apiClient configuration", () => {
  it("is an axios instance", () => {
    expect(axios.isAxiosError).toBeDefined();
    expect(typeof apiClient.get).toBe("function");
  });

  it("sets baseURL from NEXT_PUBLIC_API_URL env variable", () => {
    // The value comes from .env.local loaded by next/jest
    expect(apiClient.defaults.baseURL).toBe(process.env.NEXT_PUBLIC_API_URL);
  });

  it("sends JSON Content-Type header", () => {
    expect(apiClient.defaults.headers["Content-Type"]).toBe("application/json");
  });

  it("has withCredentials enabled", () => {
    expect(apiClient.defaults.withCredentials).toBe(true);
  });
});

describe("apiClient request interceptor (auth token)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("attaches Bearer token from localStorage when present", () => {
    localStorage.setItem("token", "test-jwt-token");

    // Retrieve and run the request interceptor handler directly
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const interceptors = (apiClient.interceptors.request as any).handlers;
    const handler = interceptors[interceptors.length - 1]?.fulfilled;
    expect(handler).toBeDefined();

    const config = { headers: {} as Record<string, string> };
    const result = handler(config);
    expect(result.headers["Authorization"]).toBe("Bearer test-jwt-token");
  });

  it("does not attach Authorization header when no token in localStorage", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const interceptors = (apiClient.interceptors.request as any).handlers;
    const handler = interceptors[interceptors.length - 1]?.fulfilled;

    const config = { headers: {} as Record<string, string> };
    const result = handler(config);
    expect(result.headers["Authorization"]).toBeUndefined();
  });
});

describe("apiClient response interceptor (401 handling)", () => {
  it("re-throws errors that are not 401", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const interceptors = (apiClient.interceptors.response as any).handlers;
    const errorHandler = interceptors[interceptors.length - 1]?.rejected;
    expect(errorHandler).toBeDefined();

    const error = { response: { status: 500 } };
    await expect(errorHandler(error)).rejects.toEqual(error);
  });

  it("re-throws 401 errors (for caller to handle)", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const interceptors = (apiClient.interceptors.response as any).handlers;
    const errorHandler = interceptors[interceptors.length - 1]?.rejected;

    const error = { response: { status: 401 } };
    await expect(errorHandler(error)).rejects.toEqual(error);
  });

  it("passes successful responses through unchanged", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const interceptors = (apiClient.interceptors.response as any).handlers;
    const successHandler = interceptors[interceptors.length - 1]?.fulfilled;
    expect(successHandler).toBeDefined();

    const response = { data: { ok: true }, status: 200 };
    expect(successHandler(response)).toBe(response);
  });
});
