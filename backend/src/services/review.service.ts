import { Types } from "mongoose";
import { Review, IReview, Game } from "../models";
import { AppError } from "../middlewares/errorHandler";
import { PaginationMeta } from "../utils/response";

export interface GetReviewsQuery {
  page?: number;
  limit?: number;
  gameId?: string;
  userId?: string;
}

export interface CreateReviewInput {
  game: string;
  user: string;
  content: string;
  rating: number;
  images?: string[];
}

export interface UpdateReviewInput {
  content?: string;
  rating?: number;
  images?: string[];
}

const updateGameAvgRating = async (gameId: string): Promise<void> => {
  // Ensure we match by ObjectId to avoid type mismatch in aggregation
  const gameObjectId = new Types.ObjectId(gameId);

  const result = await Review.aggregate([
    { $match: { game: gameObjectId } },
    { $group: { _id: "$game", avgRating: { $avg: "$rating" } } },
  ]);

  const avgRating =
    result.length > 0 ? Math.round(result[0].avgRating * 10) / 10 : 0;

  await Game.findByIdAndUpdate(gameId, { avgRating });
};

export const getReviews = async (
  query: GetReviewsQuery
): Promise<{ reviews: IReview[]; pagination: PaginationMeta }> => {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};

  if (query.gameId) {
    filter.game = query.gameId;
  }

  if (query.userId) {
    filter.user = query.userId;
  }

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate("user", "username avatarUrl")
      .populate("game", "name coverImageUrl")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Review.countDocuments(filter),
  ]);

  return {
    reviews,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getReviewById = async (id: string): Promise<IReview> => {
  const review = await Review.findById(id)
    .populate("user", "username avatarUrl")
    .populate("game", "name coverImageUrl");

  if (!review) {
    throw new AppError("Review not found", 404);
  }

  return review;
};

export const createReview = async (
  input: CreateReviewInput
): Promise<IReview> => {
  const existingReview = await Review.findOne({
    game: input.game,
    user: input.user,
  });

  if (existingReview) {
    throw new AppError("You have already reviewed this game", 400);
  }

  const review = await Review.create(input);

  await updateGameAvgRating(input.game);

  return review.populate([
    { path: "user", select: "username avatarUrl" },
    { path: "game", select: "name coverImageUrl" },
  ]);
};

export const updateReview = async (
  id: string,
  input: UpdateReviewInput
): Promise<IReview> => {
  const review = await Review.findByIdAndUpdate(
    id,
    { $set: input },
    { new: true, runValidators: true }
  )
    .populate("user", "username avatarUrl")
    .populate("game", "name coverImageUrl");

  if (!review) {
    throw new AppError("Review not found", 404);
  }

  if (input.rating !== undefined) {
    await updateGameAvgRating(review.game.toString());
  }

  return review;
};

export const deleteReview = async (id: string): Promise<void> => {
  const review = await Review.findById(id);

  if (!review) {
    throw new AppError("Review not found", 404);
  }

  const gameId = review.game.toString();

  await Review.findByIdAndDelete(id);

  await updateGameAvgRating(gameId);
};

export const isReviewOwner = async (
  reviewId: string,
  userId: string
): Promise<boolean> => {
  const review = await Review.findById(reviewId);
  return review?.user.toString() === userId;
};
