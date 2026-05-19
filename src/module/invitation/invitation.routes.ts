import { Router } from "express";
import { invitationController } from "./invitation.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

router.use(protect);

// Must come BEFORE param routes
router.get("/my", invitationController.getMyInvitations);

// Param routes
router.post("/:eventId/invite", invitationController.send);
router.patch("/:invitationId/respond", invitationController.respond);
router.get("/:eventId/invitations", invitationController.getSentInvitations);

export default router;
