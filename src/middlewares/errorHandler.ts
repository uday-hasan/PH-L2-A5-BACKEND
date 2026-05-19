import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // Known operational error
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  // Zod validation error
  if (err instanceof ZodError) {
    res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: err.issues.map((e) => ({ field: e.path.join("."), message: e.message })),
    });
    return;
  }

  // Prisma unique constraint violation
  if ((err as { code?: string }).code === "P2002") {
    res.status(409).json({ success: false, message: "Resource already exists" });
    return;
  }

  // Prisma record not found
  if ((err as { code?: string }).code === "P2025") {
    res.status(404).json({ success: false, message: "Resource not found" });
    return;
  }

  console.error("[ERROR]", err);
  res.status(500).json({ success: false, message: "Internal server error" });
};
