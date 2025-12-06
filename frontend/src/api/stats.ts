import api from './axios';

export interface StatsSummary {
  totalUsers: number;
  totalPosts: number;
  totalReviews: number;
  totalComments: number;
  totalGames: number;
  topPostsByViews: Array<{
    _id: string;
    title: string;
    views: number;
    slug: string;
  }>;
  topGamesByRating: Array<{
    _id: string;
    name: string;
    avgRating: number;
    coverImageUrl: string;
  }>;
}

export interface StatsResponse {
  success: boolean;
  data: StatsSummary;
}

export const statsApi = {
  getSummary: async (limit = 5): Promise<StatsResponse> => {
    const response = await api.get<StatsResponse>(`/stats/summary?limit=${limit}`);
    return response.data;
  },
};


