import { Router } from "express";

import authRoutes from "./auth.route";
import experienceRoutes from "./experience.route";
import bookingRoutes from "./booking.route";
import userBookingsRoutes from "./user-booking.routes";
import healthRoutes from "./health.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/experiences", experienceRoutes);
router.use("/experiences", bookingRoutes); 
router.use("/bookings", userBookingsRoutes);
router.use("/health", healthRoutes);

export default router;
