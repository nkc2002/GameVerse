import { Request, Response, NextFunction } from "express";
import { postService } from "../services";
import { sendSuccess, sendError } from "../utils/response";
import { AppError } from "../middlewares/errorHandler";

export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, limit, category, author, status, sort } = req.query;

    const result = await postService.getPosts({
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      category: category as string,
      author: author as string,
      status: status as "draft" | "published",
      sort: sort as "newest" | "views",
    });

    sendSuccess(res, result.posts, "Posts retrieved", 200, result.pagination);
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const post = await postService.getPostById(req.params.id, true);
    sendSuccess(res, post, "Post retrieved");
  } catch (error) {
    next(error);
  }
};

export const getPostBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const post = await postService.getPostBySlug(req.params.slug, true);
    sendSuccess(res, post, "Post retrieved");
  } catch (error) {
    next(error);
  }
};

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const post = await postService.createPost({
      ...req.body,
      author: req.user!.userId,
    });
    sendSuccess(res, post, "Post created", 201);
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Check ownership for editor role (admin can edit any post)
    if (req.user!.role === "editor") {
      const post = await postService.getPostById(id);
      if (post.author._id.toString() !== req.user!.userId) {
        throw new AppError("You can only edit your own posts", 403);
      }
    }

    const updatedPost = await postService.updatePost(id, req.body);
    sendSuccess(res, updatedPost, "Post updated");
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Check ownership for editor role (admin can delete any post)
    if (req.user!.role === "editor") {
      const post = await postService.getPostById(id);
      if (post.author._id.toString() !== req.user!.userId) {
        throw new AppError("You can only delete your own posts", 403);
      }
    }

    await postService.deletePost(id);
    sendSuccess(res, null, "Post deleted");
  } catch (error) {
    next(error);
  }
};
