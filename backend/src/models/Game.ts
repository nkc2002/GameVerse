import mongoose, { Document, Schema } from 'mongoose';

export interface IGame extends Document {
  name: string;
  coverImageUrl: string;
  genres: string[];
  platforms: string[];
  releaseDate: Date;
  description: string;
  avgRating: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const gameSchema = new Schema<IGame>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    coverImageUrl: {
      type: String,
      default: '',
    },
    genres: [{
      type: String,
      trim: true,
    }],
    platforms: [{
      type: String,
      trim: true,
    }],
    releaseDate: {
      type: Date,
    },
    description: {
      type: String,
      default: '',
    },
    avgRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

gameSchema.index({ name: 'text' });
gameSchema.index({ genres: 1 });
gameSchema.index({ platforms: 1 });
gameSchema.index({ avgRating: -1 });
gameSchema.index({ views: -1 });
gameSchema.index({ createdAt: -1 });

export const Game = mongoose.model<IGame>('Game', gameSchema);


