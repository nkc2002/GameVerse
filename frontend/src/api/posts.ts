import api from "./axios";
import { PaginationMeta } from "./games";

export interface Post {
  _id: string;
  title: string;
  content: string;
  thumbnailUrl: string;
  category: string;
  author: {
    _id: string;
    username: string;
    avatarUrl?: string;
  };
  status: "draft" | "published";
  slug: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostsQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  author?: string;
  status?: "draft" | "published";
  sort?: "newest" | "views";
}

export interface PostsResponse {
  success: boolean;
  data: Post[];
  pagination: PaginationMeta;
}

export interface PostResponse {
  success: boolean;
  data: Post;
}

export const postsApi = {
  getAll: async (query: PostsQuery = {}): Promise<PostsResponse> => {
    const params = new URLSearchParams();
    if (query.page) params.append("page", query.page.toString());
    if (query.limit) params.append("limit", query.limit.toString());
    if (query.search) params.append("search", query.search);
    if (query.category) params.append("category", query.category);
    if (query.author) params.append("author", query.author);
    if (query.status) params.append("status", query.status);
    if (query.sort) params.append("sort", query.sort);

    const response = await api.get<PostsResponse>(
      `/posts?${params.toString()}`
    );
    return response.data;
  },

  getById: async (id: string): Promise<PostResponse> => {
    const response = await api.get<PostResponse>(`/posts/${id}`);
    return response.data;
  },

  getBySlug: async (slug: string): Promise<PostResponse> => {
    const response = await api.get<PostResponse>(`/posts/slug/${slug}`);
    return response.data;
  },

  create: async (data: Partial<Post>): Promise<PostResponse> => {
    const response = await api.post<PostResponse>("/posts", data);
    return response.data;
  },

  update: async (id: string, data: Partial<Post>): Promise<PostResponse> => {
    const response = await api.put<PostResponse>(`/posts/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },
};
