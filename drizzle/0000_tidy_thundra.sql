CREATE TYPE "public"."booking_status" AS ENUM('confirmed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."experience_status" AS ENUM('draft', 'published', 'blocked');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'host', 'user');--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"experience_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"seats" integer NOT NULL,
	"status" "booking_status" DEFAULT 'confirmed' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_confirmed_booking" UNIQUE("user_id","experience_id","status")
);
--> statement-breakpoint
CREATE TABLE "experiences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" varchar(2000) NOT NULL,
	"location" varchar(200) NOT NULL,
	"price" integer NOT NULL,
	"start_time" timestamp NOT NULL,
	"created_by" uuid NOT NULL,
	"status" "experience_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"role" "role" DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_experience_id_experiences_id_fk" FOREIGN KEY ("experience_id") REFERENCES "public"."experiences"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_user_experience" ON "bookings" USING btree ("user_id","experience_id");--> statement-breakpoint
CREATE INDEX "idx_experience" ON "bookings" USING btree ("experience_id");--> statement-breakpoint
CREATE INDEX "idx_location_start_time" ON "experiences" USING btree ("location","start_time");--> statement-breakpoint
CREATE INDEX "idx_status_start_time" ON "experiences" USING btree ("status","start_time");--> statement-breakpoint
CREATE INDEX "idx_created_by" ON "experiences" USING btree ("created_by");