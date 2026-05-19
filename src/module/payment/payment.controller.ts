import type { Request, Response } from "express";
import { paymentService } from "./payment.service";
import { ApiResponse } from "../../utils/ApiResponse";
import { catchAsync } from "../../utils/catchAsync";

export const paymentController = {
  // Raw body needed for Stripe signature verification — registered before json middleware
  webhook: async (req: Request, res: Response): Promise<void> => {
    const sig = req.headers["stripe-signature"] as string;
    const event = paymentService.constructWebhookEvent(req.body as Buffer, sig);

    if (event.type === "checkout.session.completed") {
      await paymentService.handleCheckoutComplete(event.data.object);
    }

    res.json({ received: true });
  },

  getMyPayments: catchAsync(async (req: Request, res: Response) => {
    const data = await paymentService.getMyPayments(req.user!.id);
    ApiResponse.success(res, data);
  }),
};
