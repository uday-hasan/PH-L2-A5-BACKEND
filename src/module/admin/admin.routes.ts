import { Router } from "express";
import { adminController } from "./admin.controller";
import { protect, restrictTo } from "../../middlewares/auth.middleware";
import { Role } from "../../../prisma/generated/prisma/enums";

const router = Router();

router.use(protect, restrictTo(Role.ADMIN));

router.get("/stats", adminController.getStats);
router.get("/events", adminController.getAllEvents);
router.get("/users", adminController.getAllUsers);
router.delete("/users/:id", adminController.deleteUser);

export default router;
