import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { gamesApi, GamesQuery, Game } from "../api";
import type { GamesResponse } from "../api/games";

export const useGames = (query: GamesQuery = {}) => {
  return useQuery<GamesResponse>({
    queryKey: ["games", query],
    queryFn: () => gamesApi.getAll(query),
  });
};

export const useGame = (id: string) => {
  return useQuery({
    queryKey: ["game", id],
    queryFn: () => gamesApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Game>) => gamesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });
};

export const useUpdateGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Game> }) =>
      gamesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });
};

export const useDeleteGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => gamesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });
};
