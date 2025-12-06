import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authApi, User } from "../api/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    username: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USE_HTTPONLY_COOKIES =
  import.meta.env.VITE_USE_HTTPONLY_COOKIES === "true";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  const fetchUser = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      const userData = await authApi.getMe();
      setUser(userData);
    } catch {
      localStorage.removeItem("accessToken");
      if (!USE_HTTPONLY_COOKIES) {
        localStorage.removeItem("refreshToken");
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    // Clear all cached queries before login to prevent stale data from previous user
    queryClient.clear();

    const response = await authApi.login({ email, password });
    const { user: userData, accessToken, refreshToken } = response.data;

    localStorage.setItem("accessToken", accessToken);
    if (refreshToken && !USE_HTTPONLY_COOKIES) {
      localStorage.setItem("refreshToken", refreshToken);
    }

    setUser(userData);
  };

  const register = async (
    email: string,
    password: string,
    username: string
  ) => {
    // Clear all cached queries before register to prevent stale data
    queryClient.clear();

    const response = await authApi.register({ email, password, username });
    const { user: userData, accessToken, refreshToken } = response.data;

    localStorage.setItem("accessToken", accessToken);
    if (refreshToken && !USE_HTTPONLY_COOKIES) {
      localStorage.setItem("refreshToken", refreshToken);
    }

    setUser(userData);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem("accessToken");
      if (!USE_HTTPONLY_COOKIES) {
        localStorage.removeItem("refreshToken");
      }
      // Clear all cached queries on logout to prevent data leaking to next user
      queryClient.clear();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
