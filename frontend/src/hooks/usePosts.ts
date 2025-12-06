import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postsApi, PostsQuery, Post } from "../api";
import type { PostsResponse } from "../api/posts";

export const usePosts = (query: PostsQuery = {}) => {
  return useQuery<PostsResponse>({
    queryKey: ["posts", query],
    queryFn: () => postsApi.getAll(query),
    keepPreviousData: true, // avoid losing list when searching/filtering
  });
};

export const usePost = (id: string) => {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => postsApi.getById(id),
    enabled: !!id,
  });
};

export const usePostBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["post", "slug", slug],
    queryFn: () => postsApi.getBySlug(slug),
    enabled: !!slug,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Post>) => postsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Post> }) =>
      postsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
