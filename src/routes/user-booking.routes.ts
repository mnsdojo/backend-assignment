


import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware';
import { uuidSchema } from '../validators/common.validator';
import { bookingController } from '../controller/booking.controller';
import { validate } from '../validators/validator.middleware';

const router = Router();

// GET /bookings/my - Get current user's bookings
router.get('/my', requireAuth, bookingController.getMyBookings.bind(bookingController));

// GET /bookings/:id - Get booking by ID
router.get(
  '/:id',
  requireAuth,
  validate(uuidSchema, 'params'),
  bookingController.getBooking.bind(bookingController)
);

// PATCH /bookings/:id/cancel - Cancel booking
router.patch(
  '/:id/cancel',
  requireAuth,
  validate(uuidSchema, 'params'),
  bookingController.cancelBooking.bind(bookingController)
);

export default router;
