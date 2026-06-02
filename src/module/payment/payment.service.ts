import {
  InvitationStatus,
  ParticipationStatus,
  PaymentStatus,
} from "../../../prisma/generated/prisma/client.js";
import type Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { config } from "../../config";
import { ApiError } from "../../utils/ApiError";

export const paymentService = {
  constructWebhookEvent(payload: Buffer, sig: string): Stripe.Event {
    try {
      return stripe.webhooks.constructEvent(payload, sig, config.stripe.webhookSecret);
    } catch {
      throw new ApiError(400, "Invalid webhook signature");
    }
  },

  async handleCheckoutComplete(session: Stripe.Checkout.Session) {
    const payment = await prisma.payment.findUnique({
      where: { stripeSessionId: session.id },
    });
    if (!payment) return;

    // Mark payment as PAID
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.PAID, stripePaymentId: session.payment_intent as string },
    });

    // Update participation if linked
    if (payment.participationId) {
      const participation = await prisma.participation.findUnique({
        where: { id: payment.participationId },
        include: { event: true },
      });

      // If it's a private event, keep as PENDING (needs host approval)
      // If it's a public event or organizer invitation, set to APPROVED
      const isPrivate = participation?.event.visibility === "PRIVATE";
      const newStatus = isPrivate ? ParticipationStatus.PENDING : ParticipationStatus.APPROVED;

      await prisma.participation.update({
        where: { id: payment.participationId },
        data: { status: newStatus },
      });
    }

    // Update invitation if linked (for backward compatibility)
    if (payment.invitationId) {
      await prisma.invitation.update({
        where: { id: payment.invitationId },
        data: { status: InvitationStatus.ACCEPTED },
      });
    }
  },

  async getMyPayments(userId: string) {
    return prisma.payment.findMany({
      where: { userId },
      include: {
        event: { select: { id: true, title: true, slug: true, date: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },
};
