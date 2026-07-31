import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useTags, usePostsByTag, tagKeys } from "@/hooks/queries/useTags";

jest.mock("@/lib/axios", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

import { apiClient } from "@/lib/axios";
const mockGet = apiClient.get as jest.Mock;

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

const samplePost = {
  id: "1",
  slug: "post-slug",
  title: "Post Title",
  title_hy: "Վերնագիր",
  content: "content",
  content_hy: "բ",
  cover_image: "https://example.com/img.jpg",
  author: "Author",
  author_id: "a1",
  meta_description: "desc",
  meta_description_hy: "d",
  tags: ["javascript"],
  published: true,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-02T00:00:00Z",
};

describe("tagKeys", () => {
  it("all returns ['tags']", () => {
    expect(tagKeys.all).toEqual(["tags"]);
  });

  it("detail includes the tag name", () => {
    expect(tagKeys.detail("react")).toEqual(["tags", "detail", "react"]);
  });
});

describe("useTags", () => {
  beforeEach(() => mockGet.mockClear());

  it("fetches tags list from /tags", async () => {
    mockGet.mockResolvedValueOnce({ data: { tags: ["javascript", "react"] } });
    const { result } = renderHook(() => useTags(), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockGet).toHaveBeenCalledWith("/tags");
    expect(result.current.data).toEqual(["javascript", "react"]);
  });

  it("returns isError when API fails", async () => {
    mockGet.mockRejectedValueOnce(new Error("500"));
    const { result } = renderHook(() => useTags(), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("usePostsByTag", () => {
  beforeEach(() => mockGet.mockClear());

  it("fetches posts filtered by tag", async () => {
    mockGet.mockResolvedValueOnce({ data: { posts: [samplePost] } });
    const { result } = renderHook(() => usePostsByTag("javascript"), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockGet).toHaveBeenCalledWith("/posts?tag=javascript");
    expect(result.current.data).toEqual([samplePost]);
  });

  it("does not fetch when tag is empty string", () => {
    const { result } = renderHook(() => usePostsByTag(""), {
      wrapper: makeWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
    expect(mockGet).not.toHaveBeenCalled();
  });

  it("returns isError when API fails", async () => {
    mockGet.mockRejectedValueOnce(new Error("Network error"));
    const { result } = renderHook(() => usePostsByTag("react"), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
