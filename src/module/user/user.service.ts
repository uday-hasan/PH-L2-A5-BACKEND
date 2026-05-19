import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import type { UpdateProfileInput } from "./user.schema";

const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatar: true,
  bio: true,
  notifyEmail: true,
  createdAt: true,
};

export const userService = {
  async updateProfile(userId: string, input: UpdateProfileInput) {
    return prisma.user.update({
      where: { id: userId },
      data: input,
      select: safeUserSelect,
    });
  },

  // Admin only
  async getAllUsers(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({ skip, take: limit, select: safeUserSelect, orderBy: { createdAt: "desc" } }),
      prisma.user.count(),
    ]);
    return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async deleteUser(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ApiError(404, "User not found");
    await prisma.user.delete({ where: { id: userId } });
  },
};
