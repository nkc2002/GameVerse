import { useQuery } from '@tanstack/react-query';
import { statsApi } from '../api';

export const useStats = (limit = 5) => {
  return useQuery({
    queryKey: ['stats', limit],
    queryFn: () => statsApi.getSummary(limit),
  });
};


