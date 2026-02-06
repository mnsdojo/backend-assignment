import { Request, Response, NextFunction } from "express";
import {
  extractToken,
  ForbiddenError,
  UnauthorizedError,
  verifyToken,
} from "../utils";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = extractToken(req.headers.authorization);

    if (!token) {
      throw new UnauthorizedError("No token provided");
    }

    const payload = await verifyToken(token);
    req.user = payload;

    next();
  } catch (error) {
    next(new UnauthorizedError("Invalid or expired token"));
  }
};

export const requireRole = (...roles: ("admin" | "host" | "user")[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      next(new UnauthorizedError("Authentication required"));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(
        new ForbiddenError(
          `Access denied. Required roles: ${roles.join(", ")}`,
        ),
      );
      return;
    }
    next();
  };
};

export const requireOwnerOrAdmin = (
  getUserIdFromParams: (req: Request) => string,
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError("Authentication required"));
      return;
    }

    const resourceOwnerId = getUserIdFromParams(req);

    if (req.user.userId !== resourceOwnerId && req.user.role !== "admin") {
      next(
        new ForbiddenError("Access denied. You must be the owner or an admin"),
      );
      return;
    }

    next();
  };
};


