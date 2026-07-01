import { apiClient } from "@/lib/axios";
import { Post } from "@/types/blog";
import { useQuery } from "@tanstack/react-query";

export const tagKeys = {
  all: ["tags"] as const,
  detail: (tag: string) => ["tags", "detail", tag] as const,
};

export function useTags() {
  return useQuery<string[]>({
    queryKey: tagKeys.all,
    queryFn: async () => {
      const { data } = await apiClient.get("/tags");
      return data.tags;
    },
    staleTime: Infinity,
  });
}

export function usePostsByTag(tag: string) {
  return useQuery<Post[]>({
    queryKey: tagKeys.detail(tag),
    queryFn: async () => {
      const { data } = await apiClient.get(`/posts?tag=${tag}`);
      return data.posts;
    },
    enabled: !!tag,
    staleTime: 60_000,
  });
}
