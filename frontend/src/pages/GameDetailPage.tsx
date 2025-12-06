import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, Eye, Gamepad2, ArrowLeft } from "lucide-react";
import { RatingStars } from "../components/reviews/RatingStars";
import { LoadingSpinner } from "../components/shared/LoadingSpinner";
import { ErrorMessage } from "../components/shared/ErrorMessage";
import { useAuth } from "../auth/AuthContext";
import { useGame } from "../hooks/useGames";
import { useReviews, useCreateReview } from "../hooks/useReviews";
import { Game } from "../api/games";
import type { Review } from "../api";

export const GameDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewContent, setReviewContent] = useState("");

  const {
    data: gameData,
    isLoading: gameLoading,
    error: gameError,
  } = useGame(id || "");
  const { data: reviewsData } = useReviews({ gameId: id });
  const createReview = useCreateReview();

  const game: Partial<Game> = (gameData as any)?.data || {};
  const reviews: Review[] = (reviewsData as any)?.data || [];

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || reviewRating === 0 || !reviewContent.trim()) {
      alert("Please provide a rating and review content");
      return;
    }

    try {
      await createReview.mutateAsync({
        game: id,
        rating: reviewRating,
        content: reviewContent,
      });
      alert("Review submitted successfully!");
      setShowReviewForm(false);
      setReviewRating(0);
      setReviewContent("");
    } catch (error) {
      alert("Failed to submit review: " + (error as Error).message);
    }
  };

  if (gameLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (gameError || !game._id) {
    return (
      <div className="min-h-screen bg-dark pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <ErrorMessage message="Failed to load game details. Please try again." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/games"
          className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Games
        </Link>

        {/* Game Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-primary-500/30">
              {game.coverImageUrl ? (
                <img
                  src={game.coverImageUrl}
                  alt={game.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-dark-200 flex items-center justify-center">
                  <Gamepad2 className="w-24 h-24 text-primary-400/50" />
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h1 className="text-4xl font-display text-gradient mb-4">
              {game.name}
            </h1>

            <div className="flex flex-wrap gap-2 mb-6">
              {(game.genres || []).map((genre: string) => (
                <span
                  key={genre}
                  className="px-4 py-2 bg-primary-500/20 text-primary-300 text-sm font-medium rounded-lg"
                >
                  {genre}
                </span>
              ))}
            </div>

            <div className="bg-dark-100 border border-primary-500/30 rounded-2xl p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-slate-500 text-sm mb-2">Rating</p>
                  <RatingStars rating={game.avgRating || 0} size="lg" />
                </div>
                <div>
                  <p className="text-slate-500 text-sm mb-2">Release Date</p>
                  <div className="flex items-center gap-2 text-slate-200">
                    <Calendar className="w-5 h-5" />
                    <span className="font-medium">
                      {game.releaseDate
                        ? new Date(game.releaseDate).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-slate-500 text-sm mb-2">Views</p>
                  <div className="flex items-center gap-2 text-slate-200">
                    <Eye className="w-5 h-5" />
                    <span className="font-medium">
                      {(game.views || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-display text-slate-200 mb-3">
                Platforms
              </h2>
              <div className="flex flex-wrap gap-2">
                {(game.platforms || []).map((platform: string) => (
                  <span
                    key={platform}
                    className="px-4 py-2 bg-dark-100 border border-primary-500/30 text-slate-300 text-sm rounded-lg"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-display text-slate-200 mb-3">
                Description
              </h2>
              <p className="text-slate-400 font-body leading-relaxed">
                {game.description || "No description available."}
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-dark-100 border border-primary-500/30 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display text-gradient">Reviews</h2>
            {isAuthenticated && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors cursor-pointer"
              >
                {showReviewForm ? "Cancel" : "Write Review"}
              </button>
            )}
          </div>

          {showReviewForm && (
            <div className="bg-dark-200 border border-primary-500/30 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-display text-slate-200 mb-4">
                Write Your Review
              </h3>
              <form className="space-y-4" onSubmit={handleSubmitReview}>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Your Rating
                  </label>
                  <RatingStars
                    rating={reviewRating}
                    interactive
                    onRate={setReviewRating}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Review
                  </label>
                  <textarea
                    rows={6}
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    className="w-full px-4 py-3 bg-dark border border-primary-500/30 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors font-body resize-none"
                    placeholder="Share your thoughts about this game..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={createReview.isPending}
                  className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors cursor-pointer disabled:opacity-50"
                >
                  {createReview.isPending ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          )}

          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-dark-200 border border-primary-500/30 rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-500/30 flex items-center justify-center">
                      <span className="text-primary-400 font-medium">
                        {review.user.username.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-200">
                        {review.user.username}
                      </p>
                      <p className="text-sm text-slate-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <RatingStars rating={review.rating} size="sm" />
                </div>
                <p className="text-slate-300 font-body leading-relaxed">
                  {review.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
