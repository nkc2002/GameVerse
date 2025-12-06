import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Gamepad2,
  Newspaper,
  MessageSquare,
  Star,
  TrendingUp,
  Eye,
} from "lucide-react";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";
import { useStats } from "../../hooks/useStats";

export const DashboardPage: React.FC = () => {
  const { data: statsData, isLoading, error } = useStats();

  const apiStats = statsData?.data;
  const stats = {
    totalUsers: apiStats?.totalUsers || 0,
    totalGames: apiStats?.totalGames || 0,
    totalPosts: apiStats?.totalPosts || 0,
    totalReviews: apiStats?.totalReviews || 0,
    totalComments: apiStats?.totalComments || 0,
    topGames: apiStats?.topGamesByRating || [],
    topPosts: apiStats?.topPostsByViews || [],
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    // Show dashboard anyway with zeros if API fails (user might not be admin)
    console.error("Stats API error:", error);
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      link: "/admin/users",
    },
    {
      title: "Total Games",
      value: stats.totalGames,
      icon: Gamepad2,
      color: "from-purple-500 to-pink-500",
      link: "/admin/games",
    },
    {
      title: "Total Posts",
      value: stats.totalPosts,
      icon: Newspaper,
      color: "from-green-500 to-emerald-500",
      link: "/admin/posts",
    },
    {
      title: "Total Reviews",
      value: stats.totalReviews,
      icon: Star,
      color: "from-yellow-500 to-orange-500",
      link: "#",
    },
    {
      title: "Total Comments",
      value: stats.totalComments,
      icon: MessageSquare,
      color: "from-red-500 to-rose-500",
      link: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-dark pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-display text-gradient mb-4">
            Admin Dashboard
          </h1>
          <p className="text-slate-400 font-body">
            Manage your GameVerse platform
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {statCards.map((stat) => (
            <Link
              key={stat.title}
              to={stat.link}
              className="bg-dark-100 border border-primary-500/30 rounded-2xl p-6 hover:border-primary-500 hover:shadow-neon transition-all duration-300 cursor-pointer group"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-slate-400 text-sm mb-2">{stat.title}</p>
              <p className="text-3xl font-display text-slate-100">
                {stat.value.toLocaleString()}
              </p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Games */}
          <div className="bg-dark-100 border border-primary-500/30 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-primary-400" />
              <h2 className="text-2xl font-display text-gradient">
                Top Rated Games
              </h2>
            </div>
            <div className="space-y-4">
              {stats.topGames.length > 0 ? (
                stats.topGames.map((game: any, index: number) => (
                  <div
                    key={game._id || index}
                    className="flex items-center justify-between p-4 bg-dark-200 border border-primary-500/20 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                        <span className="text-primary-400 font-display text-lg">
                          #{index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-200">
                          {game.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          Rating: {game.avgRating?.toFixed(1) || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="text-lg font-display text-slate-200">
                        {game.avgRating?.toFixed(1) || "0"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-center py-4">No games yet</p>
              )}
            </div>
          </div>

          {/* Top Posts */}
          <div className="bg-dark-100 border border-primary-500/30 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="w-6 h-6 text-primary-400" />
              <h2 className="text-2xl font-display text-gradient">
                Most Viewed Posts
              </h2>
            </div>
            <div className="space-y-4">
              {stats.topPosts.length > 0 ? (
                stats.topPosts.map((post: any, index: number) => (
                  <div
                    key={post._id || index}
                    className="flex items-center justify-between p-4 bg-dark-200 border border-primary-500/20 rounded-xl"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-400 font-display text-lg">
                          #{index + 1}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-200 truncate">
                          {post.title}
                        </p>
                        <p className="text-sm text-slate-500">{post.slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                      <Eye className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300 font-medium">
                        {(post.views || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-center py-4">No posts yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/admin/games"
            className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-primary-500/30 rounded-2xl p-8 hover:border-primary-500 hover:shadow-neon transition-all duration-300 cursor-pointer group"
          >
            <Gamepad2 className="w-12 h-12 text-primary-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-display text-slate-100 mb-2">
              Manage Games
            </h3>
            <p className="text-slate-400 font-body text-sm">
              Add, edit, or remove games
            </p>
          </Link>

          <Link
            to="/admin/posts"
            className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-primary-500/30 rounded-2xl p-8 hover:border-primary-500 hover:shadow-neon transition-all duration-300 cursor-pointer group"
          >
            <Newspaper className="w-12 h-12 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-display text-slate-100 mb-2">
              Manage Posts
            </h3>
            <p className="text-slate-400 font-body text-sm">
              Create and manage content
            </p>
          </Link>

          <Link
            to="/admin/users"
            className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-primary-500/30 rounded-2xl p-8 hover:border-primary-500 hover:shadow-neon transition-all duration-300 cursor-pointer group"
          >
            <Users className="w-12 h-12 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-display text-slate-100 mb-2">
              Manage Users
            </h3>
            <p className="text-slate-400 font-body text-sm">
              View and manage users
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};
