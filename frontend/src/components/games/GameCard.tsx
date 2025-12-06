import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Eye } from "lucide-react";
import { RatingStars } from "../reviews/RatingStars";

interface GameCardProps {
  game: {
    _id: string;
    name: string;
    coverImageUrl: string;
    genres: string[];
    platforms: string[];
    releaseDate: string;
    avgRating: number;
    views: number;
  };
}

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
  return (
    <Link
      to={`/games/${game._id}`}
      className="group bg-dark-100 border border-primary-500/30 rounded-2xl overflow-hidden hover:border-primary-500 hover:shadow-neon transition-all duration-300 cursor-pointer"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        {game.coverImageUrl ? (
          <img
            src={game.coverImageUrl}
            alt={game.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-dark-200 flex items-center justify-center">
            <span className="text-4xl font-display text-primary-400/50">
              {game.name.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-display text-slate-100 mb-3 group-hover:text-primary-400 transition-colors line-clamp-1">
          {game.name}
        </h3>

        <div className="flex flex-wrap gap-2 mb-4">
          {game.genres.slice(0, 3).map((genre) => (
            <span
              key={genre}
              className="px-3 py-1 bg-primary-500/20 text-primary-300 text-xs font-medium rounded-lg"
            >
              {genre}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <RatingStars rating={game.avgRating ?? 0} size="sm" />
          <div className="flex items-center gap-1 text-slate-400 text-sm">
            <Eye className="w-4 h-4" />
            <span>{game.views}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <Calendar className="w-4 h-4" />
          <span>{new Date(game.releaseDate).getFullYear()}</span>
        </div>
      </div>
    </Link>
  );
};
