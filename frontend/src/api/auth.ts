import api from "./axios";

export interface User {
  _id: string;
  id?: string;
  email: string;
  username: string;
  role: "admin" | "editor" | "user";
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  username: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken?: string;
  };
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      "/auth/register",
      credentials
    );
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  refresh: async (): Promise<{
    accessToken: string;
    refreshToken?: string;
  }> => {
    const response = await api.post("/auth/refresh");
    return response.data.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get("/users/me");
    return response.data.data;
  },
};
