import type { Request, Response } from "express";
import { EventVisibility } from "../../../prisma/generated/prisma/client.js";
import { eventService } from "./event.service";
import { ApiResponse } from "../../utils/ApiResponse";
import { catchAsync } from "../../utils/catchAsync";

export const eventController = {
  create: catchAsync(async (req: Request, res: Response) => {
    const event = await eventService.create(req.body, req.user!.id);
    ApiResponse.created(res, event, "Event created");
  }),

  getAll: catchAsync(async (req: Request, res: Response) => {
    const data = await eventService.getAll({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      search: req.query.search as string,
      visibility: req.query.visibility as EventVisibility,
      paid: req.query.paid as string,
    });
    ApiResponse.success(res, data);
  }),

  getUpcoming: catchAsync(async (_req: Request, res: Response) => {
    const events = await eventService.getUpcoming();
    ApiResponse.success(res, events);
  }),

  getFeatured: catchAsync(async (_req: Request, res: Response) => {
    const event = await eventService.getFeatured();
    ApiResponse.success(res, event);
  }),

  getBySlug: catchAsync(async (req: Request, res: Response) => {
    const event = await eventService.getBySlug(req.params.slug as string);
    ApiResponse.success(res, event);
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const event = await eventService.update(
      req.params.slug as string,
      req.body,
      req.user!.id,
      req.user!.role,
    );
    ApiResponse.success(res, event, "Event updated");
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    await eventService.delete(req.params.slug as string, req.user!.id, req.user!.role);
    ApiResponse.noContent(res);
  }),

  setFeatured: catchAsync(async (req: Request, res: Response) => {
    const event = await eventService.setFeatured(req.params.slug as string);
    ApiResponse.success(res, event, "Featured event updated");
  }),

  getMyEvents: catchAsync(async (req: Request, res: Response) => {
    const events = await eventService.getMyEvents(req.user!.id);
    ApiResponse.success(res, events);
  }),
};
