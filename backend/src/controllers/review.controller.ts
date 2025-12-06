import { Request, Response, NextFunction } from 'express';
import { reviewService } from '../services';
import { sendSuccess, sendError } from '../utils/response';

export const getReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, gameId, userId } = req.query;
    
    const result = await reviewService.getReviews({
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      gameId: gameId as string,
      userId: userId as string,
    });
    
    sendSuccess(res, result.reviews, 'Reviews retrieved', 200, result.pagination);
  } catch (error) {
    next(error);
  }
};

export const getReviewById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const review = await reviewService.getReviewById(req.params.id);
    sendSuccess(res, review, 'Review retrieved');
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const review = await reviewService.createReview({
      ...req.body,
      user: req.user!.userId,
    });
    sendSuccess(res, review, 'Review created', 201);
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const currentUser = req.user!;
    
    if (currentUser.role !== 'admin') {
      const isOwner = await reviewService.isReviewOwner(id, currentUser.userId);
      if (!isOwner) {
        sendError(res, 'Not authorized to update this review', 403);
        return;
      }
    }
    
    const review = await reviewService.updateReview(id, req.body);
    sendSuccess(res, review, 'Review updated');
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const currentUser = req.user!;
    
    if (currentUser.role !== 'admin') {
      const isOwner = await reviewService.isReviewOwner(id, currentUser.userId);
      if (!isOwner) {
        sendError(res, 'Not authorized to delete this review', 403);
        return;
      }
    }
    
    await reviewService.deleteReview(id);
    sendSuccess(res, null, 'Review deleted');
  } catch (error) {
    next(error);
  }
};


