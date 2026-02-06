import { z } from "zod";
import { uuidSchema } from "./common.validator";

export const createExperienceSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title is too long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description is too long"),
  location: z
    .string()
    .min(2, "Location is required")
    .max(200, "Location is too long"),
  price: z
    .number()
    .int("Price must be an integer")
    .positive("Price must be positive"),
  start_time: z.string().datetime("Invalid datetime format"),
});

export const listExperiencesSchema = z.object({
  location: z.string().optional(),
  from: z.string().datetime("Invalid from datetime").optional(),
  to: z.string().datetime("Invalid to datetime").optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sort: z.enum(["asc", "desc"]).default("asc"),
});

export const experienceIdSchema = z.object({
  id: uuidSchema,
});

// Export types
export type CreateExperienceInput = z.infer<typeof createExperienceSchema>;
export type ListExperiencesQuery = z.infer<typeof listExperiencesSchema>;
export type ExperienceIdParam = z.infer<typeof experienceIdSchema>;
