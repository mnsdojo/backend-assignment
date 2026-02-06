import { Request, Response, NextFunction } from "express";
import { bookingService } from "../services/booking.service";
import type { CreateBookingInput } from "../validators/booking.validator";

export class BookingController {
  async createBooking(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const experienceId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      const data: CreateBookingInput = req.body;
      const userId = (req as any).user.userId;
      const userRole = (req as any).user.role;

      const booking = await bookingService.createBooking(
        experienceId,
        data,
        userId,
        userRole,
      );

      res.status(201).json({ booking });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /bookings/my
   */
  async getMyBookings(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const bookings = await bookingService.getMyBookings(userId);

      res.status(200).json({ bookings });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /bookings/:id
   */
  async getBooking(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      const booking = await bookingService.getBookingById(id);

      res.status(200).json({ booking });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /bookings/:id/cancel
   */
  async cancelBooking(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      const userId = (req as any).user.userId;
      const userRole = (req as any).user.role;

      const booking = await bookingService.cancelBooking(id, userId, userRole);

      res.status(200).json({ booking });
    } catch (error) {
      next(error);
    }
  }


  async getExperienceBookings(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      const userId = (req as any).user.userId;
      const userRole = (req as any).user.role;

      const bookings = await bookingService.getExperienceBookings(
        id,
        userId,
        userRole,
      );

      res.status(200).json({ bookings });
    } catch (error) {
      next(error);
    }
  }
}

export const bookingController = new BookingController();
