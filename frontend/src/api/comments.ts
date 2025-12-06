import api from './axios';
import { PaginationMeta } from './games';

export interface Comment {
  _id: string;
  parent?: string;
  post?: string;
  review?: string;
  user: {
    _id: string;
    username: string;
    avatarUrl?: string;
  };
  content: string;
  createdAt: string;
  replies?: Comment[];
}

export interface CommentsQuery {
  page?: number;
  limit?: number;
  postId?: string;
  reviewId?: string;
}

export interface CommentsResponse {
  success: boolean;
  data: Comment[];
  pagination: PaginationMeta;
}

export interface CommentResponse {
  success: boolean;
  data: Comment;
}

export const commentsApi = {
  getAll: async (query: CommentsQuery = {}): Promise<CommentsResponse> => {
    const params = new URLSearchParams();
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.postId) params.append('postId', query.postId);
    if (query.reviewId) params.append('reviewId', query.reviewId);
    
    const response = await api.get<CommentsResponse>(`/comments?${params.toString()}`);
    return response.data;
  },

  create: async (data: { content: string; post?: string; review?: string; parent?: string }): Promise<CommentResponse> => {
    const response = await api.post<CommentResponse>('/comments', data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/comments/${id}`);
  },
};


