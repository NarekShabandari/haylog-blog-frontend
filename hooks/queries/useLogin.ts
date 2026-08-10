import { apiClient } from "@/lib/axios";
import { setCredentials } from "@/store/slices/authSlice";
import { useMutation } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "./useAppDispatch";

export function useLogin() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const locale = useLocale();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await apiClient.post("/auth/login", credentials);
      return data;
    },
    onSuccess: (data) => {
      dispatch(setCredentials({ user: data.user, token: data.token }));
      router.push(`/${locale}/`);
    },
  });
}
