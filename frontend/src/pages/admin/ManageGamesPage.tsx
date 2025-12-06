import React, { useState, useEffect, useMemo } from "react";
import { Plus, Edit, Trash2, Search, Filter } from "lucide-react";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";
import { Modal } from "../../components/shared/Modal";
import { ImageUpload } from "../../components/ImageUpload";
import {
  useGames,
  useDeleteGame,
  useCreateGame,
  useUpdateGame,
} from "../../hooks/useGames";
import type { Game } from "../../api/games";

interface GameFormData {
  name: string;
  genres: string;
  platforms: string;
  releaseDate: string;
  description: string;
  coverImageUrl: string;
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const ManageGamesPage: React.FC = () => {
  const [page] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [formData, setFormData] = useState<GameFormData>({
    name: "",
    genres: "",
    platforms: "",
    releaseDate: "",
    description: "",
    coverImageUrl: "",
  });

  // Debounce search input - wait 300ms after user stops typing
  const debouncedSearch = useDebounce(searchInput, 300);

  const { data, isLoading, isFetching } = useGames({
    page,
    search: debouncedSearch,
  });
  const deleteGame = useDeleteGame();
  const createGame = useCreateGame();
  const updateGame = useUpdateGame();

  const allGames: Game[] = (data as any)?.data ?? [];

  // Extract unique genres and platforms for filters from all games
  const { genres, platforms } = useMemo(() => {
    const genreSet = new Set<string>();
    const platformSet = new Set<string>();
    allGames.forEach((game) => {
      game.genres?.forEach((g: string) => genreSet.add(g));
      game.platforms?.forEach((p: string) => platformSet.add(p));
    });
    return {
      genres: Array.from(genreSet).sort(),
      platforms: Array.from(platformSet).sort(),
    };
  }, [allGames]);

  // Filter games client-side for genre and platform
  const filteredGames = useMemo(() => {
    return allGames.filter((game: Game) => {
      const matchesGenre = !genreFilter || game.genres?.includes(genreFilter);
      const matchesPlatform =
        !platformFilter || game.platforms?.includes(platformFilter);
      return matchesGenre && matchesPlatform;
    });
  }, [allGames, genreFilter, platformFilter]);

  // Only show full screen loading on initial load (keepPreviousData prevents flicker)
  const showFullScreenLoading = isLoading && !data;

  // Reset form when modal opens/closes or selectedGame changes
  useEffect(() => {
    if (selectedGame) {
      setFormData({
        name: selectedGame.name || "",
        genres: selectedGame.genres?.join(", ") || "",
        platforms: selectedGame.platforms?.join(", ") || "",
        releaseDate: selectedGame.releaseDate?.split("T")[0] || "",
        description: selectedGame.description || "",
        coverImageUrl: selectedGame.coverImageUrl || "",
      });
    } else {
      setFormData({
        name: "",
        genres: "",
        platforms: "",
        releaseDate: "",
        description: "",
        coverImageUrl: "",
      });
    }
  }, [selectedGame, showModal]);

  const handleEdit = (game: any) => {
    setSelectedGame(game);
    setShowModal(true);
  };

  const handleDelete = async (gameId: string) => {
    if (confirm("Are you sure you want to delete this game?")) {
      try {
        await deleteGame.mutateAsync(gameId);
        alert("Game deleted successfully!");
      } catch (error) {
        alert("Failed to delete game: " + (error as Error).message);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const gameData = {
      name: formData.name,
      genres: formData.genres
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean),
      platforms: formData.platforms
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean),
      releaseDate: formData.releaseDate,
      description: formData.description,
      coverImageUrl: formData.coverImageUrl,
    };

    try {
      if (selectedGame) {
        await updateGame.mutateAsync({ id: selectedGame._id, data: gameData });
        alert("Game updated successfully!");
      } else {
        await createGame.mutateAsync(gameData);
        alert("Game created successfully!");
      }
      setShowModal(false);
      setSelectedGame(null);
    } catch (error) {
      alert("Failed to save game: " + (error as Error).message);
    }
  };

  if (showFullScreenLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-dark pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-display text-gradient mb-4">
              Manage Games
            </h1>
            <p className="text-slate-400 font-body">
              Add, edit, or remove games from the platform
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedGame(null);
              setShowModal(true);
            }}
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            Add Game
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-dark-100 border border-primary-500/30 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search games..."
                className="w-full pl-12 pr-4 py-3 bg-dark-200 border border-primary-500/30 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors font-body"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-dark-200 border border-primary-500/30 rounded-xl text-slate-200 focus:outline-none focus:border-primary-500 transition-colors font-body cursor-pointer appearance-none"
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-dark-200 border border-primary-500/30 rounded-xl text-slate-200 focus:outline-none focus:border-primary-500 transition-colors font-body cursor-pointer appearance-none"
              >
                <option value="">All Platforms</option>
                {platforms.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Games Table */}
        <div className="bg-dark-100 border border-primary-500/30 rounded-2xl overflow-hidden relative min-h-[200px]">
          {isFetching && filteredGames.length > 0 && (
            <div className="absolute inset-0 bg-dark/50 flex items-center justify-center z-10">
              <LoadingSpinner />
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-200 border-b border-primary-500/20">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Genres
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Platforms
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Release Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Rating
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Views
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-slate-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-500/10">
                {filteredGames.length === 0 && !isLoading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-slate-400"
                    >
                      No games found
                    </td>
                  </tr>
                )}
                {filteredGames.map((game) => (
                  <tr
                    key={game._id}
                    className="hover:bg-dark-200/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-slate-200 font-medium">
                      {game.name}
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {game.genres.join(", ")}
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {game.platforms.slice(0, 2).join(", ")}
                      {game.platforms.length > 2 && "..."}
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {new Date(game.releaseDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-slate-200 font-medium">
                      {game.avgRating}
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {game.views.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(game)}
                          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors cursor-pointer"
                          aria-label="Edit game"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(game._id)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
                          aria-label="Delete game"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Game Form Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedGame(null);
          }}
          title={selectedGame ? "Edit Game" : "Add New Game"}
          size="lg"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Game Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 bg-dark-200 border border-primary-500/30 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors font-body"
                placeholder="Enter game name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Genres (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.genres}
                  onChange={(e) =>
                    setFormData({ ...formData, genres: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-dark-200 border border-primary-500/30 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors font-body"
                  placeholder="Action, RPG, Adventure"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Platforms (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.platforms}
                  onChange={(e) =>
                    setFormData({ ...formData, platforms: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-dark-200 border border-primary-500/30 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors font-body"
                  placeholder="PC, PlayStation, Xbox"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Release Date
              </label>
              <input
                type="date"
                value={formData.releaseDate}
                onChange={(e) =>
                  setFormData({ ...formData, releaseDate: e.target.value })
                }
                className="w-full px-4 py-3 bg-dark-200 border border-primary-500/30 rounded-xl text-slate-200 focus:outline-none focus:border-primary-500 transition-colors font-body cursor-pointer"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-3 bg-dark-200 border border-primary-500/30 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors font-body resize-none"
                placeholder="Enter game description"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Cover Image
              </label>
              <ImageUpload
                onUpload={(urls) =>
                  setFormData({ ...formData, coverImageUrl: urls[0] || "" })
                }
                multiple={false}
                maxFiles={1}
                currentImages={
                  formData.coverImageUrl ? [formData.coverImageUrl] : []
                }
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setSelectedGame(null);
                }}
                className="flex-1 px-6 py-3 bg-dark-200 border border-primary-500/30 text-slate-300 rounded-xl font-medium hover:bg-dark-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createGame.isPending || updateGame.isPending}
                className="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                {createGame.isPending || updateGame.isPending
                  ? "Saving..."
                  : selectedGame
                  ? "Update Game"
                  : "Create Game"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};
