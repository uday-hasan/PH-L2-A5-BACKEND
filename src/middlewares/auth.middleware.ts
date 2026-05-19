import type { NextFunction, Request, Response } from "express";
import { Role } from "../../prisma/generated/prisma/client.js";
import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { verifyToken } from "../utils/jwt";

export const protect = async (req: Request, _res: Response, next: NextFunction) => {
  const token = req.cookies?.token as string | undefined;
  if (!token) return next(new ApiError(401, "Not authenticated"));

  try {
    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, role: true },
    });
    if (!user) return next(new ApiError(401, "User no longer exists"));
    req.user = user;
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token"));
  }
};

export const restrictTo =
  (...roles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role as Role)) {
      return next(new ApiError(403, "You do not have permission"));
    }
    next();
  };
