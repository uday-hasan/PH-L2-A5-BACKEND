import { Router } from "express";
import express from "express";
import { paymentController } from "./payment.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

// Stripe webhook — raw body required BEFORE json parsing
router.post("/webhook", express.raw({ type: "application/json" }), paymentController.webhook);

router.get("/my", protect, paymentController.getMyPayments);

export default router;
