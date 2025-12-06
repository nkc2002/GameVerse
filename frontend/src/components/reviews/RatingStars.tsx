import React from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 10,
  size = "md",
  showNumber = true,
  interactive = false,
  onRate,
}) => {
  const stars = 5;
  const normalizedRating = (rating / maxRating) * stars;

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const handleClick = (starIndex: number) => {
    if (interactive && onRate) {
      const newRating = ((starIndex + 1) / stars) * maxRating;
      onRate(Math.round(newRating * 10) / 10);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[...Array(stars)].map((_, index) => {
          const filled = index < Math.floor(normalizedRating);
          const partial =
            index === Math.floor(normalizedRating) &&
            normalizedRating % 1 !== 0;

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleClick(index)}
              disabled={!interactive}
              className={`${
                interactive
                  ? "cursor-pointer hover:scale-110"
                  : "cursor-default"
              } transition-transform disabled:cursor-default`}
              aria-label={`Rate ${index + 1} stars`}
            >
              <Star
                className={`${sizeClasses[size]} ${
                  filled || partial
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-slate-600"
                }`}
              />
            </button>
          );
        })}
      </div>
      {showNumber && (
        <span className="text-sm font-medium text-slate-300">
          {rating.toFixed(1)}/{maxRating}
        </span>
      )}
    </div>
  );
};
