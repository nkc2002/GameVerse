import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/axios";

// Get current user profile
export const useGetProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        const response = await api.get("/users/me");
        console.log("Profile response:", response.data);
        return response.data.data;
      } catch (error: any) {
        console.error(
          "Profile fetch error:",
          error.response?.data || error.message
        );
        throw error;
      }
    },
    retry: 1,
  });
};

// Update profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { username?: string; avatarUrl?: string }) => {
      const response = await api.put("/users/profile/me", data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};

// Change password
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: {
      currentPassword: string;
      newPassword: string;
    }) => {
      const response = await api.put("/users/profile/password", data);
      return response.data;
    },
  });
};
