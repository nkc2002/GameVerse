import { Game, IGame } from '../models';
import { AppError } from '../middlewares/errorHandler';
import { PaginationMeta } from '../utils/response';

export interface GetGamesQuery {
  page?: number;
  limit?: number;
  search?: string;
  genre?: string;
  platform?: string;
  sort?: 'newest' | 'avgRating' | 'views';
}

export interface CreateGameInput {
  name: string;
  coverImageUrl?: string;
  genres?: string[];
  platforms?: string[];
  releaseDate?: Date;
  description?: string;
}

export interface UpdateGameInput {
  name?: string;
  coverImageUrl?: string;
  genres?: string[];
  platforms?: string[];
  releaseDate?: Date;
  description?: string;
}

export const getGames = async (query: GetGamesQuery): Promise<{ games: IGame[]; pagination: PaginationMeta }> => {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;
  
  const filter: Record<string, unknown> = {};
  
  if (query.search) {
    filter.name = { $regex: query.search, $options: 'i' };
  }
  
  if (query.genre) {
    filter.genres = { $in: [query.genre] };
  }
  
  if (query.platform) {
    filter.platforms = { $in: [query.platform] };
  }
  
  let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
  
  if (query.sort === 'avgRating') {
    sortOption = { avgRating: -1 };
  } else if (query.sort === 'views') {
    sortOption = { views: -1 };
  }
  
  const [games, total] = await Promise.all([
    Game.find(filter).skip(skip).limit(limit).sort(sortOption),
    Game.countDocuments(filter),
  ]);
  
  return {
    games,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getGameById = async (id: string, incrementViews = false): Promise<IGame> => {
  const game = incrementViews
    ? await Game.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true })
    : await Game.findById(id);
  
  if (!game) {
    throw new AppError('Game not found', 404);
  }
  
  return game;
};

export const createGame = async (input: CreateGameInput): Promise<IGame> => {
  const game = await Game.create(input);
  return game;
};

export const updateGame = async (id: string, input: UpdateGameInput): Promise<IGame> => {
  const game = await Game.findByIdAndUpdate(
    id,
    { $set: input },
    { new: true, runValidators: true }
  );
  
  if (!game) {
    throw new AppError('Game not found', 404);
  }
  
  return game;
};

export const deleteGame = async (id: string): Promise<void> => {
  const game = await Game.findByIdAndDelete(id);
  
  if (!game) {
    throw new AppError('Game not found', 404);
  }
};


