import { z } from "zod";
import { roleEnum } from "./common.validator";

export const signupSchema = z.object({
  email: z.string().email("Invalid email format").toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long"),
  role: roleEnum.refine((role) => role === "user" || role === "host", {
    message: "Only user or host roles allowed at signup",
  }),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format").toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

// Export types
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
