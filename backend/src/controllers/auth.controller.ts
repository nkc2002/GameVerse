import { Request, Response, NextFunction } from 'express';
import { authService } from '../services';
import { sendSuccess, sendError } from '../utils/response';
import { config } from '../config';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.nodeEnv === 'production',
  sameSite: config.nodeEnv === 'production' ? 'none' as const : 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, username } = req.body;
    
    const { user, tokens } = await authService.registerUser({ email, password, username });
    
    if (config.useHttpOnlyCookies) {
      res.cookie('refreshToken', tokens.refreshToken, COOKIE_OPTIONS);
      
      sendSuccess(res, {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          role: user.role,
          avatarUrl: user.avatarUrl,
        },
        accessToken: tokens.accessToken,
      }, 'Registration successful', 201);
    } else {
      sendSuccess(res, {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          role: user.role,
          avatarUrl: user.avatarUrl,
        },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      }, 'Registration successful', 201);
    }
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    const { user, tokens } = await authService.loginUser({ email, password });
    
    if (config.useHttpOnlyCookies) {
      res.cookie('refreshToken', tokens.refreshToken, COOKIE_OPTIONS);
      
      sendSuccess(res, {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          role: user.role,
          avatarUrl: user.avatarUrl,
        },
        accessToken: tokens.accessToken,
      }, 'Login successful');
    } else {
      sendSuccess(res, {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          role: user.role,
          avatarUrl: user.avatarUrl,
        },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      }, 'Login successful');
    }
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let refreshToken: string | undefined;
    
    if (config.useHttpOnlyCookies) {
      refreshToken = req.cookies.refreshToken;
    } else {
      refreshToken = req.body.refreshToken;
    }
    
    if (!refreshToken) {
      sendError(res, 'Refresh token required', 401);
      return;
    }
    
    const tokens = await authService.refreshTokens(refreshToken);
    
    if (config.useHttpOnlyCookies) {
      res.cookie('refreshToken', tokens.refreshToken, COOKIE_OPTIONS);
      
      sendSuccess(res, {
        accessToken: tokens.accessToken,
      }, 'Token refreshed');
    } else {
      sendSuccess(res, {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      }, 'Token refreshed');
    }
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  if (config.useHttpOnlyCookies) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: config.nodeEnv === 'production' ? 'none' as const : 'lax' as const,
    });
  }
  
  sendSuccess(res, null, 'Logout successful');
};


