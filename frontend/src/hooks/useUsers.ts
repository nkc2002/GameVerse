import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi, UsersQuery, User } from "../api";
import type { UsersResponse } from "../api/users";

export const useUsers = (query: UsersQuery = {}) => {
  return useQuery<UsersResponse>({
    queryKey: ["users", query],
    queryFn: () => usersApi.getAll(query),
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      usersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
