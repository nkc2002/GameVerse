import { Comment, IComment } from '../models';
import { AppError } from '../middlewares/errorHandler';
import { PaginationMeta } from '../utils/response';
import mongoose from 'mongoose';

export interface GetCommentsQuery {
  page?: number;
  limit?: number;
  postId?: string;
  reviewId?: string;
}

export interface CreateCommentInput {
  post?: string;
  review?: string;
  parent?: string;
  user: string;
  content: string;
}

interface CommentWithReplies extends IComment {
  replies?: CommentWithReplies[];
}

export const getComments = async (query: GetCommentsQuery): Promise<{ comments: CommentWithReplies[]; pagination: PaginationMeta }> => {
  const page = query.page || 1;
  const limit = query.limit || 20;
  const skip = (page - 1) * limit;
  
  const filter: Record<string, unknown> = { parent: null };
  
  if (query.postId) {
    filter.post = query.postId;
  }
  
  if (query.reviewId) {
    filter.review = query.reviewId;
  }
  
  const [rootComments, total] = await Promise.all([
    Comment.find(filter)
      .populate('user', 'username avatarUrl')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Comment.countDocuments(filter),
  ]);
  
  const rootIds = rootComments.map(c => c._id);
  
  const replies = await Comment.find({ parent: { $in: rootIds } })
    .populate('user', 'username avatarUrl')
    .sort({ createdAt: 1 });
  
  const commentsWithReplies: CommentWithReplies[] = rootComments.map(comment => {
    const commentObj = comment.toObject() as CommentWithReplies;
    commentObj.replies = replies
      .filter(reply => reply.parent?.toString() === comment._id.toString())
      .map(reply => reply.toObject() as CommentWithReplies);
    return commentObj;
  });
  
  return {
    comments: commentsWithReplies,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getCommentById = async (id: string): Promise<IComment> => {
  const comment = await Comment.findById(id).populate('user', 'username avatarUrl');
  
  if (!comment) {
    throw new AppError('Comment not found', 404);
  }
  
  return comment;
};

export const createComment = async (input: CreateCommentInput): Promise<IComment> => {
  if (!input.post && !input.review) {
    throw new AppError('Either postId or reviewId is required', 400);
  }
  
  if (input.parent) {
    const parentComment = await Comment.findById(input.parent);
    if (!parentComment) {
      throw new AppError('Parent comment not found', 404);
    }
  }
  
  const commentData: Record<string, unknown> = {
    user: input.user,
    content: input.content,
  };
  
  if (input.post) {
    commentData.post = new mongoose.Types.ObjectId(input.post);
  }
  
  if (input.review) {
    commentData.review = new mongoose.Types.ObjectId(input.review);
  }
  
  if (input.parent) {
    commentData.parent = new mongoose.Types.ObjectId(input.parent);
  }
  
  const comment = await Comment.create(commentData);
  
  return comment.populate('user', 'username avatarUrl');
};

export const deleteComment = async (id: string): Promise<void> => {
  const comment = await Comment.findById(id);
  
  if (!comment) {
    throw new AppError('Comment not found', 404);
  }
  
  await Comment.deleteMany({ parent: id });
  
  await Comment.findByIdAndDelete(id);
};

export const isCommentOwner = async (commentId: string, userId: string): Promise<boolean> => {
  const comment = await Comment.findById(commentId);
  return comment?.user.toString() === userId;
};


