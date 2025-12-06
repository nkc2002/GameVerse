import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IComment extends Document {
  parent?: Types.ObjectId;
  post?: Types.ObjectId;
  review?: Types.ObjectId;
  user: Types.ObjectId;
  content: string;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      default: null,
    },
    review: {
      type: Schema.Types.ObjectId,
      ref: 'Review',
      default: null,
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
  },
  {
    timestamps: true,
  }
);

commentSchema.index({ post: 1 });
commentSchema.index({ review: 1 });
commentSchema.index({ parent: 1 });
commentSchema.index({ user: 1 });
commentSchema.index({ createdAt: -1 });

export const Comment = mongoose.model<IComment>('Comment', commentSchema);


