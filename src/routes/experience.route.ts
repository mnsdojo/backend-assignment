import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";
import {
  createExperienceSchema,
  listExperiencesSchema,
  experienceIdSchema,
} from "../validators/experience.validator";
import { validate } from "../validators/validator.middleware";
import { experienceController } from "../controller/experience.controller";

const router = Router();

// Public routes
// GET /experiences - List published experiences
router.get(
  "/",
  validate(listExperiencesSchema, "query"),
  experienceController.listExperiences.bind(experienceController),
);

// GET /experiences/:id - Get single experience
router.get(
  "/:id",
  validate(experienceIdSchema, "params"),
  experienceController.getExperience.bind(experienceController),
);

// Protected routes
// POST /experiences - Create experience (host/admin only)
router.post(
  "/",
  requireAuth,
  requireRole("host", "admin"),
  validate(createExperienceSchema, "body"),
  experienceController.createExperience.bind(experienceController),
);

// PATCH /experiences/:id/publish - Publish experience (owner or admin)
router.patch(
  "/:id/publish",
  requireAuth,
  requireRole("host", "admin"),
  validate(experienceIdSchema, "params"),
  experienceController.publishExperience.bind(experienceController),
);

// PATCH /experiences/:id/block - Block experience (admin only)
router.patch(
  "/:id/block",
  requireAuth,
  requireRole("admin"),
  validate(experienceIdSchema, "params"),
  experienceController.blockExperience.bind(experienceController),
);

export default router;
