import React from "react";
import { CommentCard } from "./CommentCard";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import { ErrorMessage } from "../shared/ErrorMessage";

interface CommentListProps {
  comments: any[];
  isLoading?: boolean;
  error?: string;
  currentUserId?: string;
  onReply?: (commentId: string) => void;
  onEdit?: (commentId: string) => void;
  onDelete?: (commentId: string) => void;
}

export const CommentList: React.FC<CommentListProps> = ({
  comments,
  isLoading,
  error,
  currentUserId,
  onReply,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading comments..." />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 font-body">
          No comments yet. Be the first to comment!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentCard
          key={comment._id}
          comment={comment}
          isOwner={currentUserId === comment.user._id}
          onReply={onReply ? () => onReply(comment._id) : undefined}
          onEdit={onEdit ? () => onEdit(comment._id) : undefined}
          onDelete={onDelete ? () => onDelete(comment._id) : undefined}
        />
      ))}
    </div>
  );
};
