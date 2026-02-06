import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  integer,
  pgEnum,
  unique,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ENUMS
export const roleEnum = pgEnum("role", ["admin", "host", "user"]);
export const experienceStatusEnum = pgEnum("experience_status", [
  "draft",
  "published",
  "blocked",
]);
export const bookingStatusEnum = pgEnum("booking_status", [
  "confirmed",
  "cancelled",
]);

// USERS TABLE
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password_hash: varchar("password_hash", { length: 255 }).notNull(),
  role: roleEnum("role").notNull().default("user"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// EXPERIENCES TABLE
export const experiences = pgTable(
  "experiences",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 200 }).notNull(),
    description: varchar("description", { length: 2000 }).notNull(),
    location: varchar("location", { length: 200 }).notNull(),
    price: integer("price").notNull(),
    start_time: timestamp("start_time").notNull(),
    created_by: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: experienceStatusEnum("status").notNull().default("draft"),
    created_at: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    locationStartTimeIdx: index("idx_location_start_time").on(
      table.location,
      table.start_time,
    ),
    statusStartTimeIdx: index("idx_status_start_time").on(
      table.status,
      table.start_time,
    ),
    createdByIdx: index("idx_created_by").on(table.created_by),
  }),
);

// BOOKINGS TABLE
export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    experience_id: uuid("experience_id")
      .notNull()
      .references(() => experiences.id, { onDelete: "cascade" }),
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    seats: integer("seats").notNull(),
    status: bookingStatusEnum("status").notNull().default("confirmed"),
    created_at: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    // Indexes
    userExperienceIdx: index("idx_user_experience").on(
      table.user_id,
      table.experience_id,
    ),
    experienceIdx: index("idx_experience").on(table.experience_id),
    uniqueConfirmedBooking: unique("unique_confirmed_booking").on(
      table.user_id,
      table.experience_id,
      table.status,
    ),
  }),
);

// RELATIONS
export const usersRelations = relations(users, ({ many }) => ({
  experiences: many(experiences),
  bookings: many(bookings),
}));

export const experiencesRelations = relations(experiences, ({ one, many }) => ({
  creator: one(users, {
    fields: [experiences.created_by],
    references: [users.id],
  }),
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  experience: one(experiences, {
    fields: [bookings.experience_id],
    references: [experiences.id],
  }),
  user: one(users, {
    fields: [bookings.user_id],
    references: [users.id],
  }),
}));

// TypeScript types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Experience = typeof experiences.$inferSelect;
export type NewExperience = typeof experiences.$inferInsert;

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
