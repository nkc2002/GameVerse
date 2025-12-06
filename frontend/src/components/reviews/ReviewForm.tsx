import React, { useState } from 'react';
import { RatingStars } from './RatingStars';
import { ImageUpload } from '../ImageUpload';

interface ReviewFormProps {
  onSubmit: (data: { rating: number; content: string; images?: string[] }) => void;
  onCancel?: () => void;
  initialData?: {
    rating: number;
    content: string;
    images?: string[];
  };
  isLoading?: boolean;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false
}) => {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [content, setContent] = useState(initialData?.content || '');
  const [images, setImages] = useState<string[]>(initialData?.images || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    if (content.trim().length < 10) {
      alert('Review must be at least 10 characters');
      return;
    }
    onSubmit({ rating, content, images });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Your Rating
        </label>
        <RatingStars
          rating={rating}
          interactive
          onRate={setRating}
          size="lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Your Review
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          required
          minLength={10}
          className="w-full px-4 py-3 bg-dark-200 border border-primary-500/30 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors font-body resize-none"
          placeholder="Share your thoughts about this game... (minimum 10 characters)"
        />
        <p className="text-xs text-slate-500 mt-1">
          {content.length} characters
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Images (Optional)
        </label>
        <ImageUpload
          onUpload={(urls) => setImages([...images, ...urls])}
          multiple
          maxFiles={3}
        />
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-3">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Upload ${index + 1}`}
                  className="w-full aspect-video object-cover rounded-lg border border-primary-500/20"
                />
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, i) => i !== index))}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-dark-200 border border-primary-500/30 text-slate-300 rounded-xl font-medium hover:bg-dark-300 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading || rating === 0}
          className="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? 'Submitting...' : initialData ? 'Update Review' : 'Submit Review'}
        </button>
      </div>
    </form>
  );
};
