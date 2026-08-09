CREATE TABLE "learning_modules" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"title" text NOT NULL,
	"display_name" text NOT NULL,
	"words" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"level" text
);
--> statement-breakpoint
CREATE TABLE "lessons" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"title" text NOT NULL,
	"number" integer NOT NULL,
	"display_title" text NOT NULL,
	"html" text NOT NULL,
	"related_exercises" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"type" text,
	"level" text
);
--> statement-breakpoint
CREATE TABLE "daily_quests" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"user_id" text NOT NULL,
	"day" text NOT NULL,
	"quests" jsonb DEFAULT '[]'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "progress" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"user_name" text NOT NULL,
	"module_name" text NOT NULL,
	"learned" jsonb DEFAULT '[]'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"latest_activity" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"streak" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"time_spent_learning" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"premium" boolean DEFAULT false NOT NULL,
	"exp" double precision DEFAULT 0 NOT NULL,
	"finished_lessons" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"friends" jsonb DEFAULT '[{"name":"Bartosz Cembala","friendId":"6a26d73f0bdc4ef25037767d","avatar":"5"}]'::jsonb NOT NULL,
	"avatar" text DEFAULT '1' NOT NULL,
	"quiz" jsonb DEFAULT '{"date":"","finished":false}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "learning_modules_title_unique" ON "learning_modules" USING btree ("title");--> statement-breakpoint
CREATE UNIQUE INDEX "learning_modules_display_name_unique" ON "learning_modules" USING btree ("display_name");--> statement-breakpoint
CREATE UNIQUE INDEX "lessons_title_unique" ON "lessons" USING btree ("title");--> statement-breakpoint
CREATE UNIQUE INDEX "daily_quests_user_unique" ON "daily_quests" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "progress_user_module_unique" ON "progress" USING btree ("user_name","module_name");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" USING btree ("email");