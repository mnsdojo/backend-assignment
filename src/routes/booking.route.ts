import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";
import { createBookingSchema } from "../validators/booking.validator";
import { experienceIdSchema } from "../validators/experience.validator";
import { validate } from "../validators/validator.middleware";
import { bookingController } from "../controller/booking.controller";

const router = Router();

// POST /experiences/:id/book - Create booking
router.post(
  "/:id/book",
  requireAuth,
  requireRole("user", "admin"),
  validate(experienceIdSchema, "params"),
  validate(createBookingSchema, "body"),
  bookingController.createBooking.bind(bookingController),
);

// GET /experiences/:id/bookings - Get bookings for an experience (host/admin)
router.get(
  "/:id/bookings",
  requireAuth,
  requireRole("host", "admin"),
  validate(experienceIdSchema, "params"),
  bookingController.getExperienceBookings.bind(bookingController),
);

export default router;
