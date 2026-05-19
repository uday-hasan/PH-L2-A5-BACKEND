import type { Request, Response } from "express";
import { adminService } from "./admin.service";
import { catchAsync } from "../../utils/catchAsync";
import { ApiResponse } from "../../utils/ApiResponse";

export const adminController = {
  getStats: catchAsync(async (_req: Request, res: Response) => {
    const data = await adminService.getStats();
    ApiResponse.success(res, data);
  }),

  getAllEvents: catchAsync(async (req: Request, res: Response) => {
    const data = await adminService.getAllEvents(
      Number(req.query.page) || 1,
      Number(req.query.limit) || 10,
    );
    ApiResponse.success(res, data);
  }),

  getAllUsers: catchAsync(async (req: Request, res: Response) => {
    const data = await adminService.getAllUsers(
      Number(req.query.page) || 1,
      Number(req.query.limit) || 10,
    );
    ApiResponse.success(res, data);
  }),

  deleteUser: catchAsync(async (req: Request, res: Response) => {
    const data = await adminService.deleteUser(req.params.id as string);
    ApiResponse.success(res, data);
  }),
};
