import { Request, Response, NextFunction } from "express";
import { userService } from "../services";
import { sendSuccess, sendError } from "../utils/response";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, limit, search } = req.query;

    const result = await userService.getUsers({
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      search: search as string,
    });

    sendSuccess(res, result.users, "Users retrieved", 200, result.pagination);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await userService.getUserById(req.params.id);
    sendSuccess(res, user, "User retrieved");
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const currentUser = req.user!;

    if (currentUser.role !== "admin" && currentUser.userId !== id) {
      sendError(res, "Not authorized to update this user", 403);
      return;
    }

    const updateData: Record<string, unknown> = {};

    if (req.body.username) updateData.username = req.body.username;
    if (req.body.avatarUrl) updateData.avatarUrl = req.body.avatarUrl;

    if (currentUser.role === "admin" && req.body.role) {
      updateData.role = req.body.role;
    }

    const user = await userService.updateUser(id, updateData);
    sendSuccess(res, user, "User updated");
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await userService.deleteUser(req.params.id);
    sendSuccess(res, null, "User deleted");
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await userService.getUserById(req.user!.userId);
    sendSuccess(res, user, "Current user retrieved");
  } catch (error) {
    next(error);
  }
};

// Get current user profile (alias for getMe)
export const getProfile = getMe;

// Update current user profile
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, avatarUrl } = req.body;
    const userId = req.user!.userId;

    const updateData: Record<string, unknown> = {};
    if (username) updateData.username = username;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;

    const user = await userService.updateUser(userId, updateData);
    sendSuccess(res, user, "Profile updated successfully");
  } catch (error) {
    next(error);
  }
};

// Change password
export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user!.userId;

    await userService.changePassword(userId, currentPassword, newPassword);
    sendSuccess(res, null, "Password changed successfully");
  } catch (error) {
    next(error);
  }
};
