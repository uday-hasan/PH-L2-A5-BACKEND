import type { Request, Response } from "express";
import { reviewService } from "./review.service";
import { ApiResponse } from "../../utils/ApiResponse";
import { catchAsync } from "../../utils/catchAsync";

export const reviewController = {
  create: catchAsync(async (req: Request, res: Response) => {
    const review = await reviewService.create(req.params.eventId as string, req.user!.id, req.body);
    ApiResponse.created(res, review, "Review submitted");
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const review = await reviewService.update(
      req.params.reviewId as string,
      req.user!.id,
      req.user!.role,
      req.body,
    );
    ApiResponse.success(res, review, "Review updated");
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    await reviewService.delete(req.params.reviewId as string, req.user!.id, req.user!.role);
    ApiResponse.noContent(res);
  }),

  getMyReviews: catchAsync(async (req: Request, res: Response) => {
    const data = await reviewService.getMyReviews(req.user!.id);
    ApiResponse.success(res, data);
  }),
};
