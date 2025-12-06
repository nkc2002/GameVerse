import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IReview extends Document {
  game: Types.ObjectId;
  user: Types.ObjectId;
  content: string;
  rating: number;
  images: string[];
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    game: {
      type: Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    images: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ game: 1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ createdAt: -1 });

export const Review = mongoose.model<IReview>('Review', reviewSchema);


