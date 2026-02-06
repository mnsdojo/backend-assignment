import bcrypt from "bcrypt";
import { db } from ".";
import { experiences, users, bookings } from "./schema";

async function seed() {
  console.log("SEEDING DATABASE...");

  // Hashing Operations(Passwords)
  const adminPassword = await bcrypt.hash("admin123", 10);
  const hostPassword = await bcrypt.hash("host123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  // Create users
  const [admin] = await db
    .insert(users)
    .values({
      email: "admin@example.com",
      password_hash: adminPassword,
      role: "admin",
    })
    .returning();
  console.log("Admin created:", admin.email);

  const [host] = await db
    .insert(users)
    .values({
      email: "host@example.com",
      password_hash: hostPassword,
      role: "host",
    })
    .returning();
  console.log("Host created:", host.email);

  const [user] = await db
    .insert(users)
    .values({
      email: "user@example.com",
      password_hash: userPassword,
      role: "user",
    })
    .returning();
  console.log("User created:", user.email);

  // Create experiences
  const [experience1] = await db
    .insert(experiences)
    .values({
      title: "City Food Tour",
      description: "Explore the best local cuisine with an expert guide",
      location: "New York",
      price: 5000,
      start_time: new Date("2024-12-25T10:00:00Z"),
      created_by: host.id,
      status: "published",
    })
    .returning();

  const [experience2] = await db
    .insert(experiences)
    .values({
      title: "Sunset Yoga Session",
      description: "Relax and rejuvenate with a peaceful sunset yoga class",
      location: "Los Angeles",
      price: 3000,
      start_time: new Date("2024-12-26T18:00:00Z"),
      created_by: host.id,
      status: "published",
    })
    .returning();

  const [experience3] = await db
    .insert(experiences)
    .values({
      title: "Wine Tasting Experience",
      description: "Sample the finest local wines with a sommelier",
      location: "San Francisco",
      price: 7500,
      start_time: new Date("2024-12-27T15:00:00Z"),
      created_by: host.id,
      status: "draft", // Draft status - not published
    })
    .returning();

  console.log("✅ Experiences created");

  // Create bookings
  await db.insert(bookings).values({
    experience_id: experience1.id,
    user_id: user.id,
    seats: 2,
    status: "confirmed",
  });

  await db.insert(bookings).values({
    experience_id: experience2.id,
    user_id: user.id,
    seats: 1,
    status: "confirmed",
  });

  await db.insert(bookings).values({
    experience_id: experience1.id,
    user_id: admin.id,
    seats: 3,
    status: "confirmed",
  });

  // Cancelled booking example
  await db.insert(bookings).values({
    experience_id: experience2.id,
    user_id: admin.id,
    seats: 2,
    status: "cancelled",
  });

  console.log(" Bookings created");
  console.log("Seeding completed!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
