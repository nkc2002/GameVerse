import React from "react";
import { ReviewCard } from "./ReviewCard";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import { ErrorMessage } from "../shared/ErrorMessage";

interface ReviewListProps {
  reviews: any[];
  isLoading?: boolean;
  error?: string;
  currentUserId?: string;
  onEdit?: (reviewId: string) => void;
  onDelete?: (reviewId: string) => void;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  isLoading,
  error,
  currentUserId,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading reviews..." />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 font-body">
          No reviews yet. Be the first to review!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <ReviewCard
          key={review._id}
          review={review}
          isOwner={currentUserId === review.user._id}
          onEdit={onEdit ? () => onEdit(review._id) : undefined}
          onDelete={onDelete ? () => onDelete(review._id) : undefined}
        />
      ))}
    </div>
  );
};
