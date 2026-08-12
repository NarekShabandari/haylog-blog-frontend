import { apiClient } from "@/lib/axios";
import { clearUser, setUser } from "@/store/slices/authSlice";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./useAppDispatch";

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user: reduxUser, isAuthenticated } = useAppSelector((s) => s.auth);

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const { data } = await apiClient.get("/auth/me");
      return data.user;
    },
    retry: false,
    staleTime: Infinity,
  });

  // Sync React Query → Redux
  useEffect(() => {
    if (user) dispatch(setUser(user));
    else if (isError) dispatch(clearUser());
  }, [user, isError]);

  return {
    user: reduxUser ?? user, // Redux first, React Query as fallback
    isLoggedIn: isAuthenticated,
    isLoading,
  };
}
