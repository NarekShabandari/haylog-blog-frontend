import { apiClient } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postKeys } from "./usePosts";

interface CreatePostInput {
  title: string;
  title_hy: string;
  content: string;
  content_hy: string;
  meta_description: string;
  meta_description_hy: string;
  tags: string[];
  published: boolean;
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreatePostInput) => {
      const { data } = await apiClient.post("/posts", input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}
