import { Router } from "express";
import { userController } from "./user.controller";
import { protect, restrictTo } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { updateProfileSchema } from "./user.schema";
import { Role } from "../../../prisma/generated/prisma/client.js";

const router = Router();

router.use(protect);

router.patch("/me", validate(updateProfileSchema), userController.updateProfile);

// Admin only
router.get("/", restrictTo(Role.ADMIN), userController.getAllUsers);
router.delete("/:id", restrictTo(Role.ADMIN), userController.deleteUser);

export default router;
