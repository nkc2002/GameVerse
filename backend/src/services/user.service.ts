import { User, IUser } from "../models";
import { AppError } from "../middlewares/errorHandler";
import { PaginationMeta } from "../utils/response";

export interface GetUsersQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface UpdateUserInput {
  username?: string;
  avatarUrl?: string;
  role?: "admin" | "editor" | "user";
}

export const getUsers = async (
  query: GetUsersQuery
): Promise<{ users: IUser[]; pagination: PaginationMeta }> => {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};

  if (query.search) {
    filter.$or = [
      { username: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    User.countDocuments(filter),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getUserById = async (id: string): Promise<IUser> => {
  const user = await User.findById(id).select("-password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

export const updateUser = async (
  id: string,
  input: UpdateUserInput
): Promise<IUser> => {
  const user = await User.findByIdAndUpdate(
    id,
    { $set: input },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

export const deleteUser = async (id: string): Promise<void> => {
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }
};

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  const bcrypt = require("bcryptjs");

  // Get user with password
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Verify current password
  const isPasswordValid = await user.comparePassword(currentPassword);

  if (!isPasswordValid) {
    throw new AppError("Current password is incorrect", 401);
  }

  // Hash and update new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
};
