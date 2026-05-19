import { ParticipationStatus, Role } from "../../../prisma/generated/prisma/client.js";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import type { CreateReviewInput, UpdateReviewInput } from "./review.schema";

// Review edit window: 48 hours
const REVIEW_EDIT_WINDOW_MS = 48 * 60 * 60 * 1000;

export const reviewService = {
  async create(eventId: string, userId: string, input: CreateReviewInput) {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new ApiError(404, "Event not found");

    // Must be an approved participant
    const participation = await prisma.participation.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
    if (!participation || participation.status !== ParticipationStatus.APPROVED)
      throw new ApiError(403, "You must be an approved participant to review");

    // Event must have passed
    if (new Date() < event.date) throw new ApiError(400, "Cannot review a future event");

    return prisma.review.create({
      data: { userId, eventId, ...input },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });
  },

  async update(reviewId: string, userId: string, userRole: Role, input: UpdateReviewInput) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new ApiError(404, "Review not found");
    if (review.userId !== userId && userRole !== Role.ADMIN) throw new ApiError(403, "Forbidden");

    const withinWindow = Date.now() - review.createdAt.getTime() < REVIEW_EDIT_WINDOW_MS;
    if (!withinWindow && userRole !== Role.ADMIN)
      throw new ApiError(400, "Review edit window (48h) has passed");

    return prisma.review.update({
      where: { id: reviewId },
      data: input,
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });
  },

  async delete(reviewId: string, userId: string, userRole: Role) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new ApiError(404, "Review not found");
    if (review.userId !== userId && userRole !== Role.ADMIN) throw new ApiError(403, "Forbidden");

    const withinWindow = Date.now() - review.createdAt.getTime() < REVIEW_EDIT_WINDOW_MS;
    if (!withinWindow && userRole !== Role.ADMIN)
      throw new ApiError(400, "Review delete window (48h) has passed");

    await prisma.review.delete({ where: { id: reviewId } });
  },

  async getMyReviews(userId: string) {
    return prisma.review.findMany({
      where: { userId },
      include: { event: { select: { id: true, title: true, slug: true } } },
      orderBy: { createdAt: "desc" },
    });
  },
};
