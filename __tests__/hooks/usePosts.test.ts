import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { usePosts, usePost, postKeys } from "@/hooks/queries/usePosts";

// Mock the axios apiClient
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
  slug: "hello",
  title: "Hello",
  title_hy: "Բարև",
  content: "content",
  content_hy: "content hy",
  cover_image: "https://example.com/img.jpg",
  author: "Author",
  author_id: "a1",
  meta_description: "desc",
  meta_description_hy: "desc hy",
  tags: ["js"],
  published: true,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-02T00:00:00Z",
};

describe("postKeys", () => {
  it("all returns ['posts']", () => {
    expect(postKeys.all).toEqual(["posts"]);
  });

  it("lists returns ['posts', 'list']", () => {
    expect(postKeys.lists()).toEqual(["posts", "list"]);
  });

  it("list includes filter object", () => {
    expect(postKeys.list({ category: "js" })).toEqual([
      "posts",
      "list",
      { category: "js" },
    ]);
  });

  it("detail includes slug", () => {
    expect(postKeys.detail("hello")).toEqual(["posts", "detail", "hello"]);
  });
});

describe("usePosts", () => {
  beforeEach(() => mockGet.mockClear());

  it("fetches posts from /posts", async () => {
    mockGet.mockResolvedValueOnce({ data: { posts: [samplePost] } });
    const { result } = renderHook(() => usePosts(), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockGet).toHaveBeenCalledWith("/posts", { params: undefined });
    expect(result.current.data).toEqual([samplePost]);
  });

  it("passes category param to API", async () => {
    mockGet.mockResolvedValueOnce({ data: { posts: [] } });
    const { result } = renderHook(() => usePosts({ category: "react" }), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockGet).toHaveBeenCalledWith("/posts", {
      params: { category: "react" },
    });
  });

  it("returns isError on API failure", async () => {
    mockGet.mockRejectedValueOnce(new Error("Network error"));
    const { result } = renderHook(() => usePosts(), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("usePost", () => {
  beforeEach(() => mockGet.mockClear());

  it("fetches a single post by slug", async () => {
    mockGet.mockResolvedValueOnce({ data: { post: samplePost } });
    const { result } = renderHook(() => usePost("hello"), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockGet).toHaveBeenCalledWith("/posts/hello");
    expect(result.current.data).toEqual(samplePost);
  });

  it("does not fetch when slug is empty", () => {
    const { result } = renderHook(() => usePost(""), {
      wrapper: makeWrapper(),
    });
    // enabled: false — query never fires
    expect(result.current.fetchStatus).toBe("idle");
    expect(mockGet).not.toHaveBeenCalled();
  });

  it("returns isError on API failure", async () => {
    mockGet.mockRejectedValueOnce(new Error("404"));
    const { result } = renderHook(() => usePost("bad-slug"), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
