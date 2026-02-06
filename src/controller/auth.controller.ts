import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import type { SignupInput, LoginInput } from "../validators/auth.validator";

export class AuthController {
  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: SignupInput = req.body;
      const result = await authService.signup(data);

      res.status(201).json({
        token: result.token,
        user: result.user,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: LoginInput = req.body;
      const result = await authService.login(data);

      res.status(200).json({
        token: result.token,
        user: result.user,
      });
    } catch (error) {
      next(error);
    }
  }

 
  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const user = await authService.getUserById(userId);

      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
