import { JWTPayload } from "../utils";

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}
