import { apiClient } from "./axios";

export const api = {
  posts: {
    getAll: (params?: { category?: string; search?: string; page?: number }) =>
      apiClient.get("/posts", { params }).then((r) => r.data),

    getBySlug: (slug: string) =>
      apiClient.get(`/posts/${slug}`).then((r) => r.data),

    getRelated: (slug: string) =>
      apiClient.get(`/posts/${slug}/related`).then((r) => r.data),
  },

  categories: {
    getAll: () => apiClient.get("/categories").then((r) => r.data),
  },
};
