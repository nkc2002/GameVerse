export { api } from './axios';
export { authApi } from './auth';
export { gamesApi } from './games';
export { postsApi } from './posts';
export { reviewsApi } from './reviews';
export { commentsApi } from './comments';
export { usersApi } from './users';
export { statsApi } from './stats';
export { uploadApi } from './upload';

export type { User, LoginCredentials, RegisterCredentials, AuthResponse } from './auth';
export type { Game, GamesQuery, PaginationMeta, GamesResponse, GameResponse } from './games';
export type { Post, PostsQuery, PostsResponse, PostResponse } from './posts';
export type { Review, ReviewsQuery, ReviewsResponse, ReviewResponse } from './reviews';
export type { Comment, CommentsQuery, CommentsResponse, CommentResponse } from './comments';
export type { UsersQuery, UsersResponse, UserResponse } from './users';
export type { StatsSummary, StatsResponse } from './stats';
export type { UploadResponse, MultiUploadResponse } from './upload';


