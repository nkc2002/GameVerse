import { Request, Response, NextFunction } from 'express';
import { statsService } from '../services';
import { sendSuccess } from '../utils/response';

export const getSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
    const summary = await statsService.getStatsSummary(limit);
    sendSuccess(res, summary, 'Stats summary retrieved');
  } catch (error) {
    next(error);
  }
};


