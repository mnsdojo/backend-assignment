import { and, asc, desc, eq, gte, lte } from "drizzle-orm";
import { db } from "../db";
import { experiences } from "../db/schema";
import {
  CreateExperienceInput,
  ListExperiencesQuery,
} from "../validators/experience.validator";
import { ForbiddenError, NotFoundError } from "../utils";

export class ExperienceService {
  async createExperience(data: CreateExperienceInput, userId: string) {
    const [experience] = await db
      .insert(experiences)
      .values({
        title: data.title,
        description: data.description,
        location: data.location,
        price: data.price,
        start_time: new Date(data.start_time),
        created_by: userId,
        status: "draft",
      })
      .returning();

    return experience;
  }

  async getExperienceById(id: string) {
    const experience = await db.query.experiences.findFirst({
      where: eq(experiences.id, id),
      with: {
        creator: {
          columns: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });
    if (!experience) throw new NotFoundError("Experience not found");
    return experience;
  }

  // listing published experiences based on filters
  async listExperiences(query: ListExperiencesQuery) {
    const { location, from, to, page, limit, sort } = query;
    const conditions = [eq(experiences.status, "published")];
    if (location) {
      conditions.push(eq(experiences.location, location));
    }
    if (from) {
      conditions.push(gte(experiences.start_time, new Date(from)));
    }
    if (to) {
      conditions.push(lte(experiences.start_time, new Date(to)));
    }
    const offset = (page - 1) * limit;
    const results = await db.query.experiences.findMany({
      where: and(...conditions),
      orderBy:
        sort === "desc"
          ? desc(experiences.start_time)
          : asc(experiences.start_time),
      offset,
      limit,
      with: {
        creator: {
          columns: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });
    const totalResults = await db.query.experiences.findMany({
      where: and(...conditions),
    });
    const total = totalResults.length;
    const totalPages = Math.ceil(total / limit);
    return {
      data: results,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async publishExperience(id: string, userId: string, userRole: string) {
    const experience = await this.getExperienceById(id);
    if (experience.created_by !== userId && userRole !== "admin") {
      throw new ForbiddenError("You can only publish your own experiences");
    }
    const [updated] = await db
      .update(experiences)
      .set({ status: "published" })
      .where(eq(experiences.id, id))
      .returning();
    return updated;
  }
  // Admin Only (Block Exp)
  async blockExperience(id: string) {
    const experience = await this.getExperienceById(id);
    const [updated] = await db
      .update(experiences)
      .set({ status: "blocked" })
      .where(eq(experiences.id, id))
      .returning();
    return updated;
  }

  async getMyExperiences(userId: string) {
    const results = await db.query.experiences.findMany({
      where: eq(experiences.created_by, userId),
      orderBy: desc(experiences.created_at),
    });
    return results;
  }
}

export const experienceService = new ExperienceService();
