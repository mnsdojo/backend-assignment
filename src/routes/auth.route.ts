import { Router } from "express";
import { validate } from "../validators/validator.middleware";
import { loginSchema, signupSchema } from "../validators/auth.validator";
import { authController } from "../controller/auth.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/signup",
  validate(signupSchema, "body"),
  authController.signup.bind(authController),
);

router.post(
  "/login",
  validate(loginSchema, "body"),
  authController.login.bind(authController),
);

router.get("/me", requireAuth, authController.getMe.bind(authController));

export default router;
