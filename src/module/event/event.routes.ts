import { Router } from "express";
import { eventController } from "./event.controller";
import { protect, restrictTo } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createEventSchema, updateEventSchema } from "./event.schema";
import { Role } from "../../../prisma/generated/prisma/client.js";

const router = Router();

// Public
router.get("/", eventController.getAll);
router.get("/upcoming", eventController.getUpcoming);
router.get("/featured", eventController.getFeatured);
router.get("/:slug", eventController.getBySlug);

// Authenticated
router.use(protect);
router.post("/", validate(createEventSchema), eventController.create);
router.get("/dashboard/my-events", eventController.getMyEvents);
router.patch("/:slug", validate(updateEventSchema), eventController.update);
router.delete("/:slug", eventController.delete);

// Admin only
router.patch("/:slug/feature", restrictTo(Role.ADMIN), eventController.setFeatured);

export default router;
