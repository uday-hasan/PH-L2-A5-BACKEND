import { Router } from "express";
import { reviewController } from "./review.controller";
import { protect } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createReviewSchema, updateReviewSchema } from "./review.schema";

const router = Router();

router.use(protect);

router.post("/:eventId", validate(createReviewSchema), reviewController.create);
router.get("/my", reviewController.getMyReviews);
router.patch("/:reviewId", validate(updateReviewSchema), reviewController.update);
router.delete("/:reviewId", reviewController.delete);

export default router;
