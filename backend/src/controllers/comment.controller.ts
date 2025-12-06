import { Request, Response, NextFunction } from 'express';
import { commentService } from '../services';
import { sendSuccess, sendError } from '../utils/response';

export const getComments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, postId, reviewId } = req.query;
    
    const result = await commentService.getComments({
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      postId: postId as string,
      reviewId: reviewId as string,
    });
    
    sendSuccess(res, result.comments, 'Comments retrieved', 200, result.pagination);
  } catch (error) {
    next(error);
  }
};

export const createComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const comment = await commentService.createComment({
      ...req.body,
      user: req.user!.userId,
    });
    sendSuccess(res, comment, 'Comment created', 201);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const currentUser = req.user!;
    
    if (currentUser.role !== 'admin') {
      const isOwner = await commentService.isCommentOwner(id, currentUser.userId);
      if (!isOwner) {
        sendError(res, 'Not authorized to delete this comment', 403);
        return;
      }
    }
    
    await commentService.deleteComment(id);
    sendSuccess(res, null, 'Comment deleted');
  } catch (error) {
    next(error);
  }
};


