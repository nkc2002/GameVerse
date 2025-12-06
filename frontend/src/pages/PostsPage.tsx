import React, { useState } from "react";
import { PostCard } from "../components/posts/PostCard";
import { usePosts } from "../hooks/usePosts";
import { LoadingSpinner } from "../components/shared/LoadingSpinner";
import { ErrorMessage } from "../components/shared/ErrorMessage";
import type { Post } from "../api/posts";

export const PostsPage: React.FC = () => {
  const [page] = useState(1);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<"newest" | "views">("newest");

  const { data, isLoading, error } = usePosts({
    page,
    category: category || undefined,
    sort,
  });

  const posts: Post[] = (data as any)?.data ?? [];

  const categories = [
    "News",
    "Reviews",
    "Guides",
    "Updates",
    "Features",
    "Interviews",
  ];

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <ErrorMessage message="Failed to load posts. Please try again." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-display text-gradient mb-4">
            Latest Posts
          </h1>
          <p className="text-slate-400 font-body">
            Stay updated with the latest gaming news and articles
          </p>
        </div>

        {/* Filters */}
        <div className="bg-dark-100 border border-primary-500/30 rounded-2xl p-6 mb-8">
          <div className="flex flex-wrap gap-4 mb-4">
            <button
              onClick={() => setCategory("")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer ${
                category === ""
                  ? "bg-primary-500 text-white"
                  : "bg-dark-200 text-slate-400 hover:text-slate-200"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer ${
                  category === cat
                    ? "bg-primary-500 text-white"
                    : "bg-dark-200 text-slate-400 hover:text-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-sm font-body">Sort by:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSort("newest")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer ${
                  sort === "newest"
                    ? "bg-primary-500 text-white"
                    : "bg-dark-200 text-slate-400 hover:text-slate-200"
                }`}
              >
                Newest
              </button>
              <button
                onClick={() => setSort("views")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer ${
                  sort === "views"
                    ? "bg-primary-500 text-white"
                    : "bg-dark-200 text-slate-400 hover:text-slate-200"
                }`}
              >
                Most Viewed
              </button>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {posts.length > 0 ? (
            posts.map((post: Post) => <PostCard key={post._id} post={post} />)
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-400 text-lg">
                No posts found. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
