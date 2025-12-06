import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewsApi, ReviewsQuery, Review } from "../api";

export const useReviews = (query: ReviewsQuery = {}) => {
  return useQuery({
    queryKey: ["reviews", query],
    queryFn: () => reviewsApi.getAll(query),
    keepPreviousData: true,
  });
};

export const useReview = (id: string) => {
  return useQuery({
    queryKey: ["review", id],
    queryFn: () => reviewsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      game: string;
      content: string;
      rating: number;
      images?: string[];
    }) => reviewsApi.create(data),
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["game", variables.game] });
      queryClient.invalidateQueries({ queryKey: ["games"], exact: false });
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
      gameId,
    }: {
      id: string;
      data: Partial<Review>;
      gameId?: string;
    }) => reviewsApi.update(id, data),
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["games"], exact: false });
      if (variables.gameId) {
        queryClient.invalidateQueries({ queryKey: ["game", variables.gameId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["game"], exact: false });
      }
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, gameId }: { id: string; gameId?: string }) =>
      reviewsApi.delete(id),
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["games"], exact: false });
      if (variables.gameId) {
        queryClient.invalidateQueries({ queryKey: ["game", variables.gameId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["game"], exact: false });
      }
    },
  });
};
