import { Router } from "express";
import { participationController } from "./participation.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

router.use(protect);

router.post("/:eventId/join", participationController.join);
router.get("/:eventId/participants", participationController.getParticipants);
router.patch("/:participationId/status", participationController.updateStatus);
router.get("/my", participationController.getMyParticipations);

export default router;
