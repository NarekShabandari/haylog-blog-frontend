import { apiClient } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (f: object) => [...postKeys.lists(), f] as const,
  detail: (slug: string) => [...postKeys.all, "detail", slug] as const,
};

export function usePosts(params?: { category?: string; search?: string }) {
  return useQuery({
    queryKey: postKeys.list(params ?? {}),
    queryFn: async () => {
      const { data } = await apiClient.get("/posts", { params });
      return data.posts;
    },
    staleTime: 60_000,
  });
}

export function usePost(slug: string) {
  return useQuery({
    queryKey: postKeys.detail(slug),
    queryFn: async () => {
      const { data } = await apiClient.get(`/posts/${slug}`);
      return data.post;
    },
    enabled: !!slug,
  });
}
