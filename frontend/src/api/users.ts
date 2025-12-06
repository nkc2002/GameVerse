import api from './axios';
import { User } from './auth';
import { PaginationMeta } from './games';

export interface UsersQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface UsersResponse {
  success: boolean;
  data: User[];
  pagination: PaginationMeta;
}

export interface UserResponse {
  success: boolean;
  data: User;
}

export const usersApi = {
  getAll: async (query: UsersQuery = {}): Promise<UsersResponse> => {
    const params = new URLSearchParams();
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.search) params.append('search', query.search);
    
    const response = await api.get<UsersResponse>(`/users?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<UserResponse> => {
    const response = await api.get<UserResponse>(`/users/${id}`);
    return response.data;
  },

  update: async (id: string, data: Partial<User>): Promise<UserResponse> => {
    const response = await api.put<UserResponse>(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};


