import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, User, Eye, ArrowLeft, MessageSquare } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { usePostBySlug } from "../hooks/usePosts";
import { useComments, useCreateComment } from "../hooks/useComments";
import { LoadingSpinner } from "../components/shared/LoadingSpinner";
import { ErrorMessage } from "../components/shared/ErrorMessage";
import { Post } from "../api/posts";

export const PostDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();
  const [commentText, setCommentText] = useState("");

  const {
    data: postData,
    isLoading: postLoading,
    error: postError,
  } = usePostBySlug(slug || "");
  const { data: commentsData } = useComments({ postId: postData?.data?._id });
  const createComment = useCreateComment();

  const post: Partial<Post> = postData?.data || {};
  const comments = commentsData?.data || [];

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post._id || !commentText.trim()) {
      alert("Please enter a comment");
      return;
    }

    try {
      await createComment.mutateAsync({
        post: post._id,
        content: commentText,
      });
      alert("Comment posted successfully!");
      setCommentText("");
    } catch (error) {
      alert("Failed to post comment: " + (error as Error).message);
    }
  };

  if (postLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (postError || !post._id) {
    return (
      <div className="min-h-screen bg-dark pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <ErrorMessage message="Failed to load post. Please try again." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/posts"
          className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Posts
        </Link>

        {/* Post Header */}
        <article>
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg mb-4">
              {post.category}
            </span>
            <h1 className="text-4xl font-display text-gradient mb-6">
              {post.title}
            </h1>

            <div className="flex items-center gap-6 text-slate-400 text-sm mb-8">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author?.username || "Unknown"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{(post.views || 0).toLocaleString()} views</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {post.thumbnailUrl && (
            <div className="aspect-[21/9] rounded-2xl overflow-hidden border border-primary-500/30 mb-8">
              <img
                src={post.thumbnailUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Post Content */}
          <div className="prose prose-invert prose-lg max-w-none mb-12">
            <div
              className="text-slate-300 font-body leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />
          </div>
        </article>

        {/* Comments Section */}
        <div className="bg-dark-100 border border-primary-500/30 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <MessageSquare className="w-6 h-6 text-primary-400" />
            <h2 className="text-2xl font-display text-gradient">
              Comments ({comments.length})
            </h2>
          </div>

          {/* Comment Form */}
          {isAuthenticated ? (
            <form
              onSubmit={handleSubmitComment}
              className="bg-dark-200 border border-primary-500/30 rounded-xl p-6 mb-8"
            >
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-dark border border-primary-500/30 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors font-body resize-none mb-4"
                placeholder="Share your thoughts..."
                required
              />
              <button
                type="submit"
                disabled={createComment.isPending}
                className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                {createComment.isPending ? "Posting..." : "Post Comment"}
              </button>
            </form>
          ) : (
            <div className="bg-dark-200 border border-primary-500/30 rounded-xl p-6 mb-8 text-center">
              <p className="text-slate-400 font-body mb-4">
                Please sign in to leave a comment
              </p>
              <Link
                to="/login"
                className="inline-block px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors cursor-pointer"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment._id}>
                <div className="bg-dark-200 border border-primary-500/30 rounded-xl p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary-500/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-400 font-medium">
                        {comment.user.username.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-medium text-slate-200">
                          {comment.user.username}
                        </p>
                        <p className="text-sm text-slate-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-slate-300 font-body">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-12 mt-4 space-y-4">
                    {comment.replies.map((reply: any) => (
                      <div
                        key={reply._id}
                        className="bg-dark-200/50 border border-primary-500/20 rounded-xl p-6"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-500/30 flex items-center justify-center flex-shrink-0">
                            <span className="text-primary-400 text-sm font-medium">
                              {reply.user.username.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <p className="font-medium text-slate-200 text-sm">
                                {reply.user.username}
                              </p>
                              <p className="text-xs text-slate-500">
                                {new Date(reply.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <p className="text-slate-300 font-body text-sm">
                              {reply.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
