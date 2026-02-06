import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { CreateBookingInput } from "../validators/booking.validator";
import { bookings, experiences } from "../db/schema";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../utils";

export class BookingService {
  async createBooking(
    experienceId: string,
    data: CreateBookingInput,
    userId: string,
    userRole: string,
  ) {
    const experience = await db.query.experiences.findFirst({
      where: eq(experiences.id, experienceId),
    });
    if (!experience) {
      throw new NotFoundError("Experience not found");
    }
    if (experience.status !== "published") {
      throw new BadRequestError("Cannot book unpublished experience");
    }
    if (experience.created_by === userId && userRole === "host") {
      throw new ForbiddenError("Hosts cannot book their own experiences");
    }

    // checking confirmed booking
    const existingBooking = await db.query.bookings.findFirst({
      where: and(
        eq(bookings.user_id, userId),
        eq(bookings.experience_id, experienceId),
        eq(bookings.status, "confirmed"),
      ),
    });
    if (existingBooking) {
      throw new ConflictError(
        "You already have a confirmed booking for this experience",
      );
    }

    if (data.seats < 1) {
      throw new BadRequestError("Seats must be at least 1");
    }

    const [booking] = await db
      .insert(bookings)
      .values({
        experience_id: experienceId,
        user_id: userId,
        seats: data.seats,
        status: "confirmed",
      })
      .returning();

    const bookingWithDetails = await db.query.bookings.findFirst({
      where: eq(bookings.id, booking.id),
      with: {
        experience: {
          columns: {
            id: true,
            title: true,
            location: true,
            price: true,
            start_time: true,
          },
        },
      },
    });

    return bookingWithDetails;
  }

  async getBookingById(id: string) {
    const booking = await db.query.bookings.findFirst({
      where: eq(bookings.id, id),
      with: {
        experience: true,
        user: {
          columns: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    return booking;
  }

  async getMyBookings(userId: string) {
    const results = await db.query.bookings.findMany({
      where: eq(bookings.user_id, userId),
      with: {
        experience: {
          columns: {
            id: true,
            title: true,
            location: true,
            price: true,
            start_time: true,
            status: true,
          },
        },
      },
      orderBy: (bookings, { desc }) => [desc(bookings.created_at)],
    });
    return results;
  }
  async cancelBooking(id: string, userId: string, userRole: string) {
    const booking = await this.getBookingById(id);

    if (booking.user_id !== userId && userRole !== "admin") {
      throw new ForbiddenError("You can only cancel your own bookings");
    }
    if (booking.status === "cancelled") {
      throw new BadRequestError("Booking is already cancelled");
    }
    const [updated] = await db
      .update(bookings)
      .set({ status: "cancelled" })
      .where(eq(bookings.id, id))
      .returning();

    return updated;
  }

  async getExperienceBookings(
    experienceId: string,
    userId: string,
    userRole: string,
  ) {
    const experience = await db.query.experiences.findFirst({
      where: eq(experiences.id, experienceId),
    });

    if (!experience) {
      throw new NotFoundError("Experience not found");
    }

    if (experience.created_by !== userId && userRole !== "admin") {
      throw new ForbiddenError(
        "You can only view bookings for your own experiences",
      );
    }

    const results = await db.query.bookings.findMany({
      where: eq(bookings.experience_id, experienceId),
      with: {
        user: {
          columns: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: (bookings, { desc }) => [desc(bookings.created_at)],
    });

    return results;
  }
}
export const bookingService = new BookingService();
