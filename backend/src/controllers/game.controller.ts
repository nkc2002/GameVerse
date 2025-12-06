import { Request, Response, NextFunction } from 'express';
import { gameService } from '../services';
import { sendSuccess } from '../utils/response';

export const getGames = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, search, genre, platform, sort } = req.query;
    
    const result = await gameService.getGames({
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      search: search as string,
      genre: genre as string,
      platform: platform as string,
      sort: sort as 'newest' | 'avgRating' | 'views',
    });
    
    sendSuccess(res, result.games, 'Games retrieved', 200, result.pagination);
  } catch (error) {
    next(error);
  }
};

export const getGameById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const game = await gameService.getGameById(req.params.id, true);
    sendSuccess(res, game, 'Game retrieved');
  } catch (error) {
    next(error);
  }
};

export const createGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const game = await gameService.createGame(req.body);
    sendSuccess(res, game, 'Game created', 201);
  } catch (error) {
    next(error);
  }
};

export const updateGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const game = await gameService.updateGame(req.params.id, req.body);
    sendSuccess(res, game, 'Game updated');
  } catch (error) {
    next(error);
  }
};

export const deleteGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await gameService.deleteGame(req.params.id);
    sendSuccess(res, null, 'Game deleted');
  } catch (error) {
    next(error);
  }
};


