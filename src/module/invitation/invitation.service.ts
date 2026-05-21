import { InvitationStatus, PaymentStatus, Role } from "../../../prisma/generated/prisma/client.js";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { stripe } from "../../lib/stripe";
import { config } from "../../config";
import { Request } from "express";

export const invitationService = {
  async sendInvitation(eventId: string, receiverEmail: string, senderId: string) {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new ApiError(404, "Event not found");
    if (event.organizerId !== senderId)
      throw new ApiError(403, "Only the organizer can send invitations");

    const receiver = await prisma.user.findUnique({ where: { email: receiverEmail } });
    if (!receiver) throw new ApiError(404, "User not found");
    if (receiver.id === senderId) throw new ApiError(400, "Cannot invite yourself");

    return prisma.invitation.create({
      data: { senderId, receiverId: receiver.id, eventId },
      include: {
        receiver: { select: { id: true, name: true, email: true } },
        event: { select: { id: true, title: true } },
      },
    });
  },

  async respondToInvitation(invitationId: string, userId: string, accept: boolean) {
    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
      include: { event: true },
    });
    if (!invitation) throw new ApiError(404, "Invitation not found");
    if (invitation.receiverId !== userId) throw new ApiError(403, "Forbidden");
    if (invitation.status !== InvitationStatus.PENDING)
      throw new ApiError(400, "Invitation already responded to");

    if (!accept) {
      await prisma.invitation.update({
        where: { id: invitationId },
        data: { status: InvitationStatus.DECLINED },
      });
      return { invitation: null, checkoutUrl: null };
    }

    const event = invitation.event;
    const isPaid = event.registrationFee > 0;

    if (!isPaid) {
      const updated = await prisma.invitation.update({
        where: { id: invitationId },
        data: { status: InvitationStatus.ACCEPTED },
      });
      return { invitation: updated, checkoutUrl: null };
    }

    // Paid event → Stripe checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: { name: event.title },
            unit_amount: Math.round(event.registrationFee * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${config.clientUrl}/events/${event.id}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.clientUrl}/dashboard/invitations`,
      metadata: { invitationId, userId, eventId: event.id },
    });

    await prisma.payment.create({
      data: {
        userId,
        eventId: event.id,
        amount: event.registrationFee,
        status: PaymentStatus.UNPAID,
        stripeSessionId: session.id,
        invitationId,
      },
    });

    return { invitation, checkoutUrl: session.url };
  },

  async getMyInvitations(userId: string, req: Request) {
    const status = req.params.status as InvitationStatus | "ALL";
    return prisma.invitation.findMany({
      where: { receiverId: userId, ...(status !== "ALL" ? { status } : {}) },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            slug: true,
            date: true,
            time: true,
            registrationFee: true,
            visibility: true,
          },
        },
        sender: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getSentInvitations(eventId: string, userId: string, userRole: Role) {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new ApiError(404, "Event not found");
    if (event.organizerId !== userId && userRole !== Role.ADMIN)
      throw new ApiError(403, "Forbidden");

    return prisma.invitation.findMany({
      where: { eventId },
      include: { receiver: { select: { id: true, name: true, email: true, avatar: true } } },
      orderBy: { createdAt: "desc" },
    });
  },
};
