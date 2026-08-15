/* eslint-disable @typescript-eslint/ban-ts-comment */
import { apiClient } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const locale = useLocale();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await apiClient.post("/auth/login", credentials);
      return data;
    },
    onSuccess: (data) => {
      // @ts-ignore
      queryClient.setQueriesData(["auth", "me"], data.user);
      router.push(`/${locale}/`);
    },
  });
}
