import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsApi, CommentsQuery } from '../api';

export const useComments = (query: CommentsQuery = {}) => {
  return useQuery({
    queryKey: ['comments', query],
    queryFn: () => commentsApi.getAll(query),
    enabled: !!(query.postId || query.reviewId),
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { content: string; post?: string; review?: string; parent?: string }) => commentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => commentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};


