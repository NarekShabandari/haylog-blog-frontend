import { api } from "@/lib/api";
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
    queryFn: () => api.posts.getAll(params),
    staleTime: 60_000,
  });
}

export function usePost(slug: string) {
  return useQuery({
    queryKey: postKeys.detail(slug),
    queryFn: () => api.posts.getBySlug(slug),
    enabled: !!slug,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: api.categories.getAll,
    staleTime: Infinity,
  });
}
