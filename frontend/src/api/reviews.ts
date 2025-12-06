import api from './axios';
import { PaginationMeta } from './games';

export interface Review {
  _id: string;
  game: {
    _id: string;
    name: string;
    coverImageUrl: string;
  };
  user: {
    _id: string;
    username: string;
    avatarUrl?: string;
  };
  content: string;
  rating: number;
  images: string[];
  createdAt: string;
}

export interface ReviewsQuery {
  page?: number;
  limit?: number;
  gameId?: string;
  userId?: string;
}

export interface ReviewsResponse {
  success: boolean;
  data: Review[];
  pagination: PaginationMeta;
}

export interface ReviewResponse {
  success: boolean;
  data: Review;
}

export const reviewsApi = {
  getAll: async (query: ReviewsQuery = {}): Promise<ReviewsResponse> => {
    const params = new URLSearchParams();
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.gameId) params.append('gameId', query.gameId);
    if (query.userId) params.append('userId', query.userId);
    
    const response = await api.get<ReviewsResponse>(`/reviews?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<ReviewResponse> => {
    const response = await api.get<ReviewResponse>(`/reviews/${id}`);
    return response.data;
  },

  create: async (data: { game: string; content: string; rating: number; images?: string[] }): Promise<ReviewResponse> => {
    const response = await api.post<ReviewResponse>('/reviews', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Review>): Promise<ReviewResponse> => {
    const response = await api.put<ReviewResponse>(`/reviews/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/reviews/${id}`);
  },
};


