import { Request, Response, NextFunction } from 'express';
import { uploadService } from '../services';
import { sendSuccess, sendError } from '../utils/response';

export const uploadFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      sendError(res, 'No file uploaded', 400);
      return;
    }
    
    const result = await uploadService.uploadFile(req.file.path);
    sendSuccess(res, result, 'File uploaded', 201);
  } catch (error) {
    next(error);
  }
};

export const uploadMultiple = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      sendError(res, 'No files uploaded', 400);
      return;
    }
    
    const results = await Promise.all(
      req.files.map(file => uploadService.uploadFile(file.path))
    );
    
    sendSuccess(res, results, 'Files uploaded', 201);
  } catch (error) {
    next(error);
  }
};


