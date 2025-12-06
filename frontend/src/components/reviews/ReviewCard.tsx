import React from "react";
import { User } from "lucide-react";
import { RatingStars } from "./RatingStars";

interface ReviewCardProps {
  review: {
    _id: string;
    user: {
      username: string;
      avatarUrl?: string;
    };
    rating: number;
    content: string;
    createdAt: string;
    images?: string[];
  };
  onEdit?: () => void;
  onDelete?: () => void;
  isOwner?: boolean;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onEdit,
  onDelete,
  isOwner = false,
}) => {
  return (
    <div className="bg-dark-200 border border-primary-500/30 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-500/30 flex items-center justify-center flex-shrink-0">
            {review.user.avatarUrl ? (
              <img
                src={review.user.avatarUrl}
                alt={review.user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-primary-400" />
            )}
          </div>
          <div>
            <p className="font-medium text-slate-200">{review.user.username}</p>
            <p className="text-sm text-slate-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <RatingStars rating={review.rating} size="sm" />
      </div>

      <p className="text-slate-300 font-body leading-relaxed mb-4">
        {review.content}
      </p>

      {review.images && review.images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
          {review.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Review image ${index + 1}`}
              className="w-full aspect-video object-cover rounded-lg border border-primary-500/20"
            />
          ))}
        </div>
      )}

      {isOwner && (onEdit || onDelete) && (
        <div className="flex gap-2 pt-4 border-t border-primary-500/20">
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-4 py-2 text-sm bg-dark border border-primary-500/30 text-slate-300 rounded-lg hover:bg-dark-100 transition-colors cursor-pointer"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="px-4 py-2 text-sm bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors cursor-pointer"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};
