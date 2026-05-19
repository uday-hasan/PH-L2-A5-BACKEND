import { EventVisibility, Role } from "../../../prisma/generated/prisma/client.js";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { slugify } from "../../utils/slugify";
import type { CreateEventInput, UpdateEventInput } from "./event.schema";

const eventSelect = {
  id: true,
  title: true,
  slug: true,
  description: true,
  venue: true,
  eventLink: true,
  date: true,
  time: true,
  visibility: true,
  registrationFee: true,
  isFeatured: true,
  createdAt: true,
  organizer: { select: { id: true, name: true, avatar: true } },
  _count: { select: { participations: true, reviews: true } },
};

export const eventService = {
  async create(input: CreateEventInput, organizerId: string) {
    const slug = slugify(input.title);
    return prisma.event.create({
      data: { ...input, date: new Date(input.date), slug, organizerId },
      select: eventSelect,
    });
  },

  async getAll(query: {
    page: number;
    limit: number;
    search?: string;
    visibility?: EventVisibility;
    paid?: string;
  }) {
    const { page, limit, search, visibility, paid } = query;
    const skip = (page - 1) * limit;

    const where = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { organizer: { name: { contains: search, mode: "insensitive" as const } } },
        ],
      }),
      ...(visibility && { visibility }),
      ...(paid === "true" && { registrationFee: { gt: 0 } }),
      ...(paid === "false" && { registrationFee: 0 }),
    };

    const [events, total] = await prisma.$transaction([
      prisma.event.findMany({
        where,
        skip,
        take: limit,
        select: eventSelect,
        orderBy: { date: "asc" },
      }),
      prisma.event.count({ where }),
    ]);

    return { events, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async getUpcoming(limit = 9) {
    return prisma.event.findMany({
      where: { visibility: EventVisibility.PUBLIC, date: { gte: new Date() } },
      take: limit,
      orderBy: { date: "asc" },
      select: eventSelect,
    });
  },

  async getFeatured() {
    return prisma.event.findFirst({
      where: { isFeatured: true, date: { gte: new Date() } },
      select: eventSelect,
    });
  },

  async getBySlug(slug: string) {
    const event = await prisma.event.findUnique({
      where: { slug },
      include: {
        organizer: { select: { id: true, name: true, avatar: true } },
        reviews: {
          include: { user: { select: { id: true, name: true, avatar: true } } },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { participations: true, reviews: true } },
      },
    });
    if (!event) throw new ApiError(404, "Event not found");
    return event;
  },

  async update(slug: string, input: UpdateEventInput, userId: string, userRole: Role) {
    const event = await prisma.event.findUnique({ where: { slug } });
    if (!event) throw new ApiError(404, "Event not found");
    if (event.organizerId !== userId && userRole !== Role.ADMIN)
      throw new ApiError(403, "Forbidden");

    return prisma.event.update({
      where: { slug },
      data: { ...input, ...(input.date && { date: new Date(input.date) }) },
      select: eventSelect,
    });
  },

  async delete(slug: string, userId: string, userRole: Role) {
    const event = await prisma.event.findUnique({ where: { slug } });
    if (!event) throw new ApiError(404, `Event not found`);
    if (event.organizerId !== userId && userRole !== Role.ADMIN)
      throw new ApiError(403, "Forbidden");
    await prisma.event.delete({ where: { slug } });
  },

  async setFeatured(slug: string) {
    await prisma.event.updateMany({ where: { isFeatured: true }, data: { isFeatured: false } });
    return prisma.event.update({
      where: { slug },
      data: { isFeatured: true },
      select: eventSelect,
    });
  },

  async getMyEvents(userId: string) {
    return prisma.event.findMany({
      where: { organizerId: userId },
      select: eventSelect,
      orderBy: { createdAt: "desc" },
    });
  },
};
