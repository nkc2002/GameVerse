import React, { useState } from "react";
import { GameCard } from "../components/games/GameCard";
import { SearchBar } from "../components/shared/SearchBar";
import { useGames } from "../hooks/useGames";
import { LoadingSpinner } from "../components/shared/LoadingSpinner";
import { ErrorMessage } from "../components/shared/ErrorMessage";

export const GamesPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [platform, setPlatform] = useState("");
  const [sort, setSort] = useState<"newest" | "avgRating">("avgRating");
  const [page] = useState(1);

  const { data, isLoading, error } = useGames({
    page,
    search,
    genre,
    platform,
    sort,
  });

  const genres = [
    "Action",
    "RPG",
    "Strategy",
    "Adventure",
    "Shooter",
    "Sports",
    "Racing",
    "Puzzle",
  ];
  const platforms = ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"];

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <ErrorMessage message="Failed to load games. Please try again." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-display text-gradient mb-4">
            Discover Games
          </h1>
          <p className="text-slate-400 font-body">
            Browse and search through our collection of games
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-dark-100 border border-primary-500/30 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="lg:col-span-2">
              <SearchBar
                placeholder="Search games..."
                onSearch={setSearch}
                defaultValue={search}
              />
            </div>

            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="px-4 py-3 bg-dark-200 border border-primary-500/30 rounded-xl text-slate-200 focus:outline-none focus:border-primary-500 transition-colors font-body cursor-pointer"
            >
              <option value="">All Genres</option>
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>

            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="px-4 py-3 bg-dark-200 border border-primary-500/30 rounded-xl text-slate-200 focus:outline-none focus:border-primary-500 transition-colors font-body cursor-pointer"
            >
              <option value="">All Platforms</option>
              {platforms.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-sm font-body">Sort by:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSort("avgRating")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer ${
                  sort === "avgRating"
                    ? "bg-primary-500 text-white"
                    : "bg-dark-200 text-slate-400 hover:text-slate-200"
                }`}
              >
                Top Rated
              </button>
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
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {data?.data && data.data.length > 0 ? (
            data.data.map((game) => <GameCard key={game._id} game={game} />)
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-400 text-lg">
                No games found. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
