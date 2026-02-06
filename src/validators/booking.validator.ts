import { z } from "zod";
import { uuidSchema } from "./common.validator";

export const createBookingSchema = z.object({
  seats: z
    .number()
    .int("Seats must be an integer")
    .min(1, "At least 1 seat required")
    .max(100, "Maximum 100 seats allowed"),
});

export const bookingParamsSchema = z.object({
  id: uuidSchema,
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type BookingParams = z.infer<typeof bookingParamsSchema>;
