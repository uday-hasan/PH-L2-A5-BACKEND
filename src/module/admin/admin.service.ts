import { prisma } from "../../../../../planora/planora-backend/src/lib/prisma";
import { ApiError } from "../../../../../planora/planora-backend/src/utils/ApiError";

export const adminService = {
  async getStats() {
    const [totalUsers, totalEvents, totalPayments, pendingParticipations] =
      await prisma.$transaction([
        prisma.user.count(),
        prisma.event.count(),
        prisma.payment.aggregate({ _sum: { amount: true }, where: { status: "PAID" } }),
        prisma.participation.count({ where: { status: "PENDING" } }),
      ]);

    return {
      totalUsers,
      totalEvents,
      totalRevenue: totalPayments._sum.amount ?? 0,
      pendingParticipations,
    };
  },

  async getAllEvents(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [events, total] = await prisma.$transaction([
      prisma.event.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          organizer: { select: { id: true, name: true, email: true } },
          _count: { select: { participations: true } },
        },
      }),
      prisma.event.count(),
    ]);
    return { events, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async getAllUsers(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.user.count(),
    ]);
    return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async deleteUser(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    await prisma.user.delete({ where: { id: userId } });
    return { message: "User deleted successfully" };
  },
};
