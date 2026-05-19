import type { Request, Response } from "express";
import { ParticipationStatus } from "../../../prisma/generated/prisma/client.js";
import { participationService } from "./participation.service";
import { ApiResponse } from "../../utils/ApiResponse";
import { catchAsync } from "../../utils/catchAsync";
import { ApiError } from "../../utils/ApiError";

export const participationController = {
  join: catchAsync(async (req: Request, res: Response) => {
    const result = await participationService.join(req.params.eventId as string, req.user!.id);
    ApiResponse.created(
      res,
      result,
      result.checkoutUrl ? "Proceed to payment" : "Joined successfully",
    );
  }),

  getParticipants: catchAsync(async (req: Request, res: Response) => {
    const data = await participationService.getParticipants(
      req.params.eventId as string,
      req.user!.id,
      req.user!.role,
    );
    ApiResponse.success(res, data);
  }),

  updateStatus: catchAsync(async (req: Request, res: Response) => {
    const { status } = req.body;
    if (!Object.values(ParticipationStatus).includes(status))
      throw new ApiError(422, "Invalid status");

    const data = await participationService.updateStatus(
      req.params.participationId as string,
      status,
      req.user!.id,
      req.user!.role,
    );
    ApiResponse.success(res, data, "Status updated");
  }),

  getMyParticipations: catchAsync(async (req: Request, res: Response) => {
    const data = await participationService.getMyParticipations(req.user!.id);
    ApiResponse.success(res, data);
  }),
};
