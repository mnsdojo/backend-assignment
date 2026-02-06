import { Router, Request, Response } from "express";
import { checkDbConnection } from "../db";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const isDbConnected = await checkDbConnection();
  if (isDbConnected) {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: "connected",
    });
  } else {
    res.status(503).json({
      status: "error",
      timestamp: new Date().toISOString(),
      database: "disconnected",
    });
  }
});

export default router;
