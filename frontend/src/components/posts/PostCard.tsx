import React from "react";
import { Link } from "react-router-dom";
import { Calendar, User, Eye } from "lucide-react";

interface PostCardProps {
  post: {
    _id: string;
    title: string;
    content: string;
    thumbnailUrl: string;
    category: string;
    author: {
      username: string;
      avatarUrl?: string;
    };
    createdAt: string;
    views: number;
    slug: string;
  };
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const excerpt = post.content.substring(0, 150) + "...";

  return (
    <Link
      to={`/posts/${post.slug}`}
      className="group bg-dark-100 border border-primary-500/30 rounded-2xl overflow-hidden hover:border-primary-500 hover:shadow-neon transition-all duration-300 cursor-pointer"
    >
      <div className="relative aspect-[21/9] overflow-hidden">
        {post.thumbnailUrl ? (
          <img
            src={post.thumbnailUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-dark-200 flex items-center justify-center">
            <span className="text-4xl font-display text-primary-400/50">
              {post.title.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-lg">
            {post.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-display text-slate-100 mb-3 group-hover:text-primary-400 transition-colors line-clamp-2">
          {post.title}
        </h3>

        <p className="text-slate-400 text-sm mb-4 line-clamp-2 font-body">
          {excerpt}
        </p>

        <div className="flex items-center justify-between text-slate-500 text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author.username}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{post.views}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
