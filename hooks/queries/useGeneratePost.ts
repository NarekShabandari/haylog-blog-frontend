import { apiClient } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postKeys } from "./usePosts";

interface GeneratePostInput {
  topic: string;
  targetKeyword: string;
  audience: string;
  tone: string;
  published: boolean;
}

export function useGeneratePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: GeneratePostInput) => {
      const { data } = await apiClient.post("/posts/generate", input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}
