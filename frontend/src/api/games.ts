import api from './axios';

export interface Game {
  _id: string;
  name: string;
  coverImageUrl: string;
  genres: string[];
  platforms: string[];
  releaseDate: string;
  description: string;
  avgRating: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface GamesQuery {
  page?: number;
  limit?: number;
  search?: string;
  genre?: string;
  platform?: string;
  sort?: 'newest' | 'avgRating' | 'views';
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GamesResponse {
  success: boolean;
  data: Game[];
  pagination: PaginationMeta;
}

export interface GameResponse {
  success: boolean;
  data: Game;
}

export const gamesApi = {
  getAll: async (query: GamesQuery = {}): Promise<GamesResponse> => {
    const params = new URLSearchParams();
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.search) params.append('search', query.search);
    if (query.genre) params.append('genre', query.genre);
    if (query.platform) params.append('platform', query.platform);
    if (query.sort) params.append('sort', query.sort);
    
    const response = await api.get<GamesResponse>(`/games?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<GameResponse> => {
    const response = await api.get<GameResponse>(`/games/${id}`);
    return response.data;
  },

  create: async (data: Partial<Game>): Promise<GameResponse> => {
    const response = await api.post<GameResponse>('/games', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Game>): Promise<GameResponse> => {
    const response = await api.put<GameResponse>(`/games/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/games/${id}`);
  },
};


