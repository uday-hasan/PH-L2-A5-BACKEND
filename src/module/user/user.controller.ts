import type { Request, Response } from "express";
import { userService } from "./user.service";
import { ApiResponse } from "../../utils/ApiResponse";
import { catchAsync } from "../../utils/catchAsync";

export const userController = {
  updateProfile: catchAsync(async (req: Request, res: Response) => {
    const user = await userService.updateProfile(req.user!.id, req.body);
    ApiResponse.success(res, user, "Profile updated");
  }),

  getAllUsers: catchAsync(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const data = await userService.getAllUsers(page, limit);
    ApiResponse.success(res, data);
  }),

  deleteUser: catchAsync(async (req: Request, res: Response) => {
    await userService.deleteUser(req.params.id as string);
    ApiResponse.success(res, null, "User deleted successfully", 200);
  }),
};
