import { z } from "zod";
import { EventVisibility } from "../../../prisma/generated/prisma/client.js";

export const createEventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  venue: z.string().optional(),
  eventLink: z.string().url().optional(),
  date: z.string().datetime({ message: "Invalid date format" }),
  time: z.string().min(1, "Time is required"),
  visibility: z.nativeEnum(EventVisibility).default(EventVisibility.PUBLIC),
  registrationFee: z.number().min(0).default(0),
});

export const updateEventSchema = createEventSchema.partial();

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
