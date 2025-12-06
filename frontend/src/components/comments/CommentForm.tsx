import React, { useState } from "react";

interface CommentFormProps {
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  isLoading?: boolean;
  isReply?: boolean;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  onCancel,
  placeholder = "Share your thoughts...",
  isLoading = false,
  isReply = false,
}) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim().length < 3) {
      alert("Comment must be at least 3 characters");
      return;
    }
    onSubmit(content);
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={isReply ? 3 : 4}
        required
        minLength={3}
        className="w-full px-4 py-3 bg-dark-200 border border-primary-500/30 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors font-body resize-none"
        placeholder={placeholder}
      />
      <div className="flex gap-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-2 bg-dark-200 border border-primary-500/30 text-slate-300 rounded-lg font-medium hover:bg-dark-300 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading || content.trim().length < 3}
          className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? "Posting..." : isReply ? "Reply" : "Post Comment"}
        </button>
      </div>
    </form>
  );
};
