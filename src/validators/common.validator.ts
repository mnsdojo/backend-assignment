import { z } from "zod";

export const uuidSchema = z.string().uuid("Invalid UUID format");

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const roleEnum = z.enum(["admin", "host", "user"]);
export const experienceStatusEnum = z.enum(["draft", "published", "blocked"]);
export const bookingStatusEnum = z.enum(["confirmed", "cancelled"]);

export type Role = z.infer<typeof roleEnum>;
export type ExperienceStatus = z.infer<typeof experienceStatusEnum>;
export type BookingStatus = z.infer<typeof bookingStatusEnum>;
