import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

type RequestSource = "body" | "query" | "params";

export const validate = (schema: ZodSchema, source: RequestSource = "body") => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = req[source];
      const validated = schema.parse(data);

      req[source] = validated as any;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid request data",
            details: error.issues.map((issue) => ({
              field: issue.path.join("."),
              message: issue.message,
            })),
          },
        });
        return;
      }
      next(error);
    }
  };
};
