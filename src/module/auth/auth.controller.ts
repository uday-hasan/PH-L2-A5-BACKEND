import type { Request, Response } from "express";
import { authService } from "./auth.service";
import { ApiResponse } from "../../utils/ApiResponse";
import { catchAsync } from "../../utils/catchAsync";
import { cookieOptions } from "../../utils/jwt";

export const authController = {
  register: catchAsync(async (req: Request, res: Response) => {
    const { user, token } = await authService.register(req.body);
    res.cookie("token", token, cookieOptions);
    ApiResponse.created(res, user, "Registered successfully");
  }),

  login: catchAsync(async (req: Request, res: Response) => {
    const { user, token } = await authService.login(req.body);
    res.cookie("token", token, cookieOptions);
    ApiResponse.success(res, user, "Logged in successfully");
  }),

  logout: catchAsync(async (_req: Request, res: Response) => {
    res.clearCookie("token", cookieOptions);
    ApiResponse.success(res, null, "Logged out successfully");
  }),

  getMe: catchAsync(async (req: Request, res: Response) => {
    const user = await authService.getMe(req.user!.id);
    ApiResponse.success(res, user);
  }),
};
