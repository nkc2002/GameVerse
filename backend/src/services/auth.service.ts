import { User, IUser } from '../models';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, TokenPayload } from '../utils/jwt';
import { AppError } from '../middlewares/errorHandler';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  username: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export const registerUser = async (input: RegisterInput): Promise<{ user: IUser; tokens: AuthTokens }> => {
  const existingUser = await User.findOne({ email: input.email });
  
  if (existingUser) {
    throw new AppError('Email already registered', 400);
  }
  
  const user = await User.create(input);
  
  const payload: TokenPayload = { userId: user._id.toString(), role: user.role };
  const tokens: AuthTokens = {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
  
  return { user, tokens };
};

export const loginUser = async (input: LoginInput): Promise<{ user: IUser; tokens: AuthTokens }> => {
  const user = await User.findOne({ email: input.email });
  
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }
  
  const isMatch = await user.comparePassword(input.password);
  
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }
  
  const payload: TokenPayload = { userId: user._id.toString(), role: user.role };
  const tokens: AuthTokens = {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
  
  return { user, tokens };
};

export const refreshTokens = async (refreshToken: string): Promise<AuthTokens> => {
  try {
    const decoded = verifyRefreshToken(refreshToken);
    
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    const payload: TokenPayload = { userId: user._id.toString(), role: user.role };
    
    return {
      accessToken: generateAccessToken(payload),
      refreshToken: generateRefreshToken(payload),
    };
  } catch (error) {
    throw new AppError('Invalid refresh token', 401);
  }
};


