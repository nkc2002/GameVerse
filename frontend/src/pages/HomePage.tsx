import React from "react";
import { Link } from "react-router-dom";
import { Gamepad2, Newspaper, ArrowRight } from "lucide-react";
import { GameCard } from "../components/games/GameCard";
import { PostCard } from "../components/posts/PostCard";
import { useGames } from "../hooks/useGames";
import { usePosts } from "../hooks/usePosts";

export const HomePage: React.FC = () => {
  const { data: gamesData } = useGames({ limit: 3, sort: "avgRating" });
  const { data: postsData } = usePosts({ limit: 3, sort: "newest" });

  const games = gamesData?.data || [];
  const posts = postsData?.data || [];

  return (
    <div className="min-h-screen bg-dark">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark" />

        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-display text-gradient mb-6">
            Your Ultimate
            <br />
            Gaming Hub
          </h1>

          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto font-body">
            Discover, review, and discuss the latest games. Join our community
            of passionate gamers.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/games"
              className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Gamepad2 className="w-5 h-5" />
              Explore Games
            </Link>
            <Link
              to="/posts"
              className="px-8 py-4 bg-dark-100 border border-primary-500/30 hover:border-primary-500 text-slate-200 rounded-xl font-medium transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Newspaper className="w-5 h-5" />
              Read News
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Games Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-display text-gradient mb-2">
                Top Rated Games
              </h2>
              <p className="text-slate-400 font-body">
                Discover the highest-rated games in our community
              </p>
            </div>
            <Link
              to="/games"
              className="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors cursor-pointer"
            >
              View All
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.length > 0 ? (
              games.map((game) => <GameCard key={game._id} game={game} />)
            ) : (
              <p className="col-span-full text-center text-slate-400 py-8">
                No games available yet. Check back later!
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-20 px-4 bg-dark-100/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-display text-gradient mb-2">
                Latest News
              </h2>
              <p className="text-slate-400 font-body">
                Stay updated with the latest gaming news and articles
              </p>
            </div>
            <Link
              to="/posts"
              className="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors cursor-pointer"
            >
              View All
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.length > 0 ? (
              posts.map((post) => <PostCard key={post._id} post={post} />)
            ) : (
              <p className="col-span-full text-center text-slate-400 py-8">
                No posts available yet. Check back later!
              </p>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-primary-500/20 to-dark-100 border border-primary-500/30 rounded-3xl p-12">
            <h2 className="text-4xl font-display text-gradient mb-4">
              Join Our Community
            </h2>
            <p className="text-slate-400 text-lg mb-8 font-body">
              Create an account to review games, comment on posts, and connect
              with fellow gamers.
            </p>
            <Link
              to="/register"
              className="inline-flex px-8 py-4 bg-cta hover:bg-cta-hover text-white rounded-xl font-medium transition-colors cursor-pointer"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
