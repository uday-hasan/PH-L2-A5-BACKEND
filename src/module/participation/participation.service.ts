import {
  EventVisibility,
  ParticipationStatus,
  PaymentStatus,
  Role,
} from "../../../prisma/generated/prisma/client.js";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { stripe } from "../../lib/stripe";
import { config } from "../../config";

export const participationService = {
  /**
   * Join / Request to join an event.
   * - Public Free  → status APPROVED immediately
   * - Public Paid  → create Stripe session, status PENDING (approved after payment webhook)
   * - Private Free → status PENDING (needs host approval)
   * - Private Paid → create Stripe session, status PENDING
   */
  async join(eventId: string, userId: string) {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new ApiError(404, "Event not found");

    const existing = await prisma.participation.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
    if (existing) throw new ApiError(409, "Already joined or requested");

    const isPaid = event.registrationFee > 0;
    const isPrivate = event.visibility === EventVisibility.PRIVATE;

    // Free & Public → instant approval
    if (!isPaid && !isPrivate) {
      const participation = await prisma.participation.create({
        data: { userId, eventId, status: ParticipationStatus.APPROVED },
      });
      return { participation, checkoutUrl: null };
    }

    // Create participation as PENDING first
    const participation = await prisma.participation.create({
      data: { userId, eventId, status: ParticipationStatus.PENDING },
    });

    // Paid → create Stripe checkout session
    if (isPaid) {
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
        success_url: `${config.clientUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&event_id=${event.id}&event_title=${encodeURIComponent(event.title)}&event_date=${event.date.toISOString()}&amount=${event.registrationFee}`,
        cancel_url: `${config.clientUrl}/events/${event.slug}`,
        metadata: { participationId: participation.id, userId, eventId },
      });

      await prisma.payment.create({
        data: {
          userId,
          eventId,
          amount: event.registrationFee,
          status: PaymentStatus.UNPAID,
          stripeSessionId: session.id,
          participationId: participation.id,
        },
      });

      return { participation, checkoutUrl: session.url };
    }

    // Private Free
    return { participation, checkoutUrl: null };
  },

  async getParticipants(eventId: string, requesterId: string, requesterRole: Role) {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new ApiError(404, "Event not found");
    if (event.organizerId !== requesterId && requesterRole !== Role.ADMIN)
      throw new ApiError(403, "Forbidden");

    return prisma.participation.findMany({
      where: { eventId },
      include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  async updateStatus(
    participationId: string,
    status: ParticipationStatus,
    requesterId: string,
    requesterRole: Role,
  ) {
    const p = await prisma.participation.findUnique({
      where: { id: participationId },
      include: { event: true },
    });
    if (!p) throw new ApiError(404, "Participation not found");
    if (p.event.organizerId !== requesterId && requesterRole !== Role.ADMIN)
      throw new ApiError(403, "Forbidden");

    return prisma.participation.update({
      where: { id: participationId },
      data: { status },
    });
  },

  async getMyParticipations(userId: string) {
    return prisma.participation.findMany({
      where: { userId },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            slug: true,
            date: true,
            time: true,
            venue: true,
            registrationFee: true,
            visibility: true,
            organizer: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },
};
