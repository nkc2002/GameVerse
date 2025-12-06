import React from "react";
import { User, Reply } from "lucide-react";

interface CommentCardProps {
  comment: {
    _id: string;
    user: {
      username: string;
      avatarUrl?: string;
    };
    content: string;
    createdAt: string;
    replies?: any[];
  };
  onReply?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isOwner?: boolean;
  depth?: number;
}

export const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  onReply,
  onEdit,
  onDelete,
  isOwner = false,
  depth = 0,
}) => {
  const maxDepth = 3;
  const canReply = depth < maxDepth;

  return (
    <div className={depth > 0 ? "ml-12" : ""}>
      <div
        className={`bg-dark-200 border border-primary-500/30 rounded-xl p-6 ${
          depth > 0 ? "bg-dark-200/50 border-primary-500/20" : ""
        }`}
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary-500/30 flex items-center justify-center flex-shrink-0">
            {comment.user.avatarUrl ? (
              <img
                src={comment.user.avatarUrl}
                alt={comment.user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-primary-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <p className="font-medium text-slate-200">
                {comment.user.username}
              </p>
              <p className="text-sm text-slate-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </p>
            </div>
            <p className="text-slate-300 font-body leading-relaxed">
              {comment.content}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {canReply && onReply && (
            <button
              onClick={onReply}
              className="flex items-center gap-1 text-sm text-primary-400 hover:text-primary-300 transition-colors cursor-pointer"
            >
              <Reply className="w-4 h-4" />
              Reply
            </button>
          )}
          {isOwner && (
            <>
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="text-sm text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                >
                  Delete
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply._id}
              comment={reply}
              onReply={onReply}
              isOwner={isOwner}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
