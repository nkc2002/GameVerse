import { Post, IPost } from '../models';
import { AppError } from '../middlewares/errorHandler';
import { PaginationMeta } from '../utils/response';
import { generateUniqueSlug } from '../utils/slug';

export interface GetPostsQuery {
  page?: number;
  limit?: number;
  category?: string;
  author?: string;
  status?: 'draft' | 'published';
  sort?: 'newest' | 'views';
}

export interface CreatePostInput {
  title: string;
  content: string;
  thumbnailUrl?: string;
  category: string;
  author: string;
  status?: 'draft' | 'published';
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  thumbnailUrl?: string;
  category?: string;
  status?: 'draft' | 'published';
}

export const getPosts = async (query: GetPostsQuery): Promise<{ posts: IPost[]; pagination: PaginationMeta }> => {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;
  
  const filter: Record<string, unknown> = {};
  
  if (query.category) {
    filter.category = query.category;
  }
  
  if (query.author) {
    filter.author = query.author;
  }
  
  if (query.status) {
    filter.status = query.status;
  }
  
  let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
  
  if (query.sort === 'views') {
    sortOption = { views: -1 };
  }
  
  const [posts, total] = await Promise.all([
    Post.find(filter)
      .populate('author', 'username avatarUrl')
      .skip(skip)
      .limit(limit)
      .sort(sortOption),
    Post.countDocuments(filter),
  ]);
  
  return {
    posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getPostById = async (id: string, incrementViews = false): Promise<IPost> => {
  const post = incrementViews
    ? await Post.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true }).populate('author', 'username avatarUrl')
    : await Post.findById(id).populate('author', 'username avatarUrl');
  
  if (!post) {
    throw new AppError('Post not found', 404);
  }
  
  return post;
};

export const getPostBySlug = async (slug: string, incrementViews = false): Promise<IPost> => {
  const post = incrementViews
    ? await Post.findOneAndUpdate({ slug }, { $inc: { views: 1 } }, { new: true }).populate('author', 'username avatarUrl')
    : await Post.findOne({ slug }).populate('author', 'username avatarUrl');
  
  if (!post) {
    throw new AppError('Post not found', 404);
  }
  
  return post;
};

export const createPost = async (input: CreatePostInput): Promise<IPost> => {
  const slug = await generateUniqueSlug(input.title);
  
  const post = await Post.create({
    ...input,
    slug,
  });
  
  return post.populate('author', 'username avatarUrl');
};

export const updatePost = async (id: string, input: UpdatePostInput): Promise<IPost> => {
  const updateData: Record<string, unknown> = { ...input };
  
  if (input.title) {
    updateData.slug = await generateUniqueSlug(input.title);
  }
  
  const post = await Post.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate('author', 'username avatarUrl');
  
  if (!post) {
    throw new AppError('Post not found', 404);
  }
  
  return post;
};

export const deletePost = async (id: string): Promise<void> => {
  const post = await Post.findByIdAndDelete(id);
  
  if (!post) {
    throw new AppError('Post not found', 404);
  }
};

export const isPostOwner = async (postId: string, userId: string): Promise<boolean> => {
  const post = await Post.findById(postId);
  return post?.author.toString() === userId;
};


