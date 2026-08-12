CREATE TABLE "daily_quest_progress" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"user_id" text NOT NULL,
	"day" date NOT NULL,
	"quest_key" text NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "daily_quest_progress_non_negative" CHECK ("daily_quest_progress"."progress" >= 0)
);
--> statement-breakpoint
INSERT INTO "daily_quest_progress" ("id", "user_id", "day", "quest_key", "progress", "updated_at")
SELECT
	gen_random_uuid()::text,
	legacy."user_id",
	CASE
		WHEN legacy."day" ~ '^\d{4}-\d{2}-\d{2}$' THEN legacy."day"::date
		ELSE timezone('Europe/Warsaw', now())::date
	END,
	CASE quest.ordinality
		WHEN 1 THEN 'study_time'
		WHEN 2 THEN 'learn_words'
		WHEN 3 THEN 'daily_quiz'
		WHEN 4 THEN 'complete_lesson'
	END,
	LEAST(
		CASE quest.ordinality WHEN 1 THEN 10 WHEN 2 THEN 5 ELSE 1 END,
		CASE
			WHEN quest.value->>'completed' = 'true' THEN
				CASE quest.ordinality WHEN 1 THEN 10 WHEN 2 THEN 5 ELSE 1 END
			WHEN quest.value->>'progress' ~ '^\d+$' THEN (quest.value->>'progress')::integer
			ELSE 0
		END
	),
	now()
FROM "daily_quests" legacy
INNER JOIN "users" existing_user ON existing_user."id" = legacy."user_id"
CROSS JOIN LATERAL jsonb_array_elements(
	CASE WHEN jsonb_typeof(legacy."quests") = 'array' THEN legacy."quests" ELSE '[]'::jsonb END
) WITH ORDINALITY AS quest(value, ordinality)
WHERE quest.ordinality BETWEEN 1 AND 4;
--> statement-breakpoint
DROP TABLE "daily_quests" CASCADE;--> statement-breakpoint
ALTER TABLE "daily_quest_progress" ADD CONSTRAINT "daily_quest_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "daily_quest_progress_user_day_key_unique" ON "daily_quest_progress" USING btree ("user_id","day","quest_key");--> statement-breakpoint
CREATE INDEX "daily_quest_progress_user_day_idx" ON "daily_quest_progress" USING btree ("user_id","day");
