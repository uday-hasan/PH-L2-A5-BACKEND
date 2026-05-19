import type { Request, Response } from "express";
import { invitationService } from "./invitation.service";
import { ApiResponse } from "../../utils/ApiResponse";
import { catchAsync } from "../../utils/catchAsync";

export const invitationController = {
  send: catchAsync(async (req: Request, res: Response) => {
    const { receiverEmail } = req.body;
    const data = await invitationService.sendInvitation(
      req.params.eventId as string,
      receiverEmail,
      req.user!.id,
    );
    ApiResponse.created(res, data, "Invitation sent");
  }),

  respond: catchAsync(async (req: Request, res: Response) => {
    const { accept } = req.body;
    const data = await invitationService.respondToInvitation(
      req.params.invitationId as string,
      req.user!.id,
      Boolean(accept),
    );
    const msg = accept
      ? data.checkoutUrl
        ? "Proceed to payment"
        : "Invitation accepted"
      : "Invitation declined";
    ApiResponse.success(res, data, msg);
  }),

  getMyInvitations: catchAsync(async (req: Request, res: Response) => {
    const data = await invitationService.getMyInvitations(req.user!.id);
    ApiResponse.success(res, data);
  }),

  getSentInvitations: catchAsync(async (req: Request, res: Response) => {
    const data = await invitationService.getSentInvitations(
      req.params.eventId as string,
      req.user!.id,
      req.user!.role,
    );
    ApiResponse.success(res, data);
  }),
};
