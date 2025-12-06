import { User, Post, Review, Comment, Game } from '../models';

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

export const getStatsSummary = async (topLimit = 5): Promise<StatsSummary> => {
  const [
    totalUsers,
    totalPosts,
    totalReviews,
    totalComments,
    totalGames,
    topPostsByViews,
    topGamesByRating,
  ] = await Promise.all([
    User.countDocuments(),
    Post.countDocuments(),
    Review.countDocuments(),
    Comment.countDocuments(),
    Game.countDocuments(),
    Post.find({ status: 'published' })
      .select('title views slug')
      .sort({ views: -1 })
      .limit(topLimit)
      .lean(),
    Game.find()
      .select('name avgRating coverImageUrl')
      .sort({ avgRating: -1 })
      .limit(topLimit)
      .lean(),
  ]);
  
  return {
    totalUsers,
    totalPosts,
    totalReviews,
    totalComments,
    totalGames,
    topPostsByViews: topPostsByViews.map(p => ({
      _id: p._id.toString(),
      title: p.title,
      views: p.views,
      slug: p.slug,
    })),
    topGamesByRating: topGamesByRating.map(g => ({
      _id: g._id.toString(),
      name: g.name,
      avgRating: g.avgRating,
      coverImageUrl: g.coverImageUrl,
    })),
  };
};


