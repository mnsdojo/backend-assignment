import { Request, Response, NextFunction } from "express";
import { experienceService } from "../services/experience.service";
import type {
  CreateExperienceInput,
  ListExperiencesQuery,
} from "../validators/experience.validator";

export class ExperienceController {

  async createExperience(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data: CreateExperienceInput = req.body;
      const userId = (req as any).user.userId;

      const experience = await experienceService.createExperience(data, userId);

      res.status(201).json({ experience });
    } catch (error) {
      next(error);
    }
  }


  async listExperiences(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const query: ListExperiencesQuery = req.query as any;
      const result = await experienceService.listExperiences(query);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

 
  async getExperience(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const experience = await experienceService.getExperienceById(
        Array.isArray(id) ? id[0] : id,
      );

      res.status(200).json({ experience });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /experiences/:id/publish
   */
  async publishExperience(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;
      const userRole = (req as any).user.role;

      const experience = await experienceService.publishExperience(
        Array.isArray(id) ? id[0] : id,
        userId,
        userRole,
      );

      res.status(200).json({ experience });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /experiences/:id/block
   */
  async blockExperience(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const experience = await experienceService.blockExperience(
        Array.isArray(id) ? id[0] : id,
      );

      res.status(200).json({ experience });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /experiences/my
   */
  async getMyExperiences(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const experiences = await experienceService.getMyExperiences(userId);

      res.status(200).json({ experiences });
    } catch (error) {
      next(error);
    }
  }
}

export const experienceController = new ExperienceController();
