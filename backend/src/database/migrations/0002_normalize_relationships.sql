CREATE TABLE "lesson_related_exercises" (
	"lesson_id" text NOT NULL,
	"learning_module_id" text NOT NULL,
	CONSTRAINT "lesson_related_exercises_lesson_id_learning_module_id_pk" PRIMARY KEY("lesson_id","learning_module_id")
);
--> statement-breakpoint
CREATE TABLE "user_friends" (
	"user_id" text NOT NULL,
	"friend_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_friends_user_id_friend_id_pk" PRIMARY KEY("user_id","friend_id"),
	CONSTRAINT "user_friends_not_self" CHECK ("user_friends"."user_id" <> "user_friends"."friend_id")
);
--> statement-breakpoint
CREATE TABLE "user_lesson_completions" (
	"user_id" text NOT NULL,
	"lesson_id" text NOT NULL,
	"completed_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_lesson_completions_user_id_lesson_id_pk" PRIMARY KEY("user_id","lesson_id")
);
--> statement-breakpoint
INSERT INTO "user_friends" ("user_id", "friend_id")
SELECT owner."id", friend."id"
FROM "users" owner
CROSS JOIN LATERAL jsonb_array_elements(
	CASE WHEN jsonb_typeof(owner."friends") = 'array' THEN owner."friends" ELSE '[]'::jsonb END
) AS legacy_friend(value)
INNER JOIN "users" friend ON friend."id" = legacy_friend.value->>'friendId'
WHERE owner."id" <> friend."id"
ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO "user_lesson_completions" ("user_id", "lesson_id")
SELECT owner."id", lesson."id"
FROM "users" owner
CROSS JOIN LATERAL jsonb_array_elements_text(
	CASE WHEN jsonb_typeof(owner."finished_lessons") = 'array' THEN owner."finished_lessons" ELSE '[]'::jsonb END
) AS legacy_completion(lesson_id)
INNER JOIN "lessons" lesson ON lesson."id" = legacy_completion.lesson_id
ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO "lesson_related_exercises" ("lesson_id", "learning_module_id")
SELECT lesson."id", learning_module."id"
FROM "lessons" lesson
CROSS JOIN LATERAL jsonb_array_elements_text(
	CASE WHEN jsonb_typeof(lesson."related_exercises") = 'array' THEN lesson."related_exercises" ELSE '[]'::jsonb END
) AS legacy_related(module_title)
INNER JOIN "learning_modules" learning_module ON learning_module."title" = legacy_related.module_title
ON CONFLICT DO NOTHING;
--> statement-breakpoint
DROP INDEX "progress_user_module_unique";
--> statement-breakpoint
ALTER TABLE "progress" ADD COLUMN "user_id" text;
--> statement-breakpoint
ALTER TABLE "progress" ADD COLUMN "learning_module_id" text;
--> statement-breakpoint
UPDATE "progress" entry
SET
	"user_id" = owner."id",
	"learning_module_id" = learning_module."id"
FROM "users" owner, "learning_modules" learning_module
WHERE lower(owner."email") = lower(entry."user_name")
	AND learning_module."title" = entry."module_name";
--> statement-breakpoint
DELETE FROM "progress"
WHERE "user_id" IS NULL OR "learning_module_id" IS NULL;
--> statement-breakpoint
WITH merged AS (
	SELECT
		"user_id",
		"learning_module_id",
		min("id") AS keep_id,
		coalesce(
			jsonb_agg(DISTINCT learned_pair.value) FILTER (WHERE learned_pair.value IS NOT NULL),
			'[]'::jsonb
		) AS learned
	FROM "progress"
	LEFT JOIN LATERAL jsonb_array_elements("progress"."learned") AS learned_pair(value) ON true
	GROUP BY "user_id", "learning_module_id"
)
UPDATE "progress" entry
SET "learned" = merged.learned
FROM merged
WHERE entry."id" = merged.keep_id;
--> statement-breakpoint
WITH keepers AS (
	SELECT min("id") AS keep_id, "user_id", "learning_module_id"
	FROM "progress"
	GROUP BY "user_id", "learning_module_id"
)
DELETE FROM "progress" entry
USING keepers
WHERE entry."user_id" = keepers."user_id"
	AND entry."learning_module_id" = keepers."learning_module_id"
	AND entry."id" <> keepers.keep_id;
--> statement-breakpoint
ALTER TABLE "progress" ALTER COLUMN "user_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "progress" ALTER COLUMN "learning_module_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "lesson_related_exercises" ADD CONSTRAINT "lesson_related_exercises_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "lesson_related_exercises" ADD CONSTRAINT "lesson_related_exercises_learning_module_id_learning_modules_id_fk" FOREIGN KEY ("learning_module_id") REFERENCES "public"."learning_modules"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "user_friends" ADD CONSTRAINT "user_friends_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "user_friends" ADD CONSTRAINT "user_friends_friend_id_users_id_fk" FOREIGN KEY ("friend_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "user_lesson_completions" ADD CONSTRAINT "user_lesson_completions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "user_lesson_completions" ADD CONSTRAINT "user_lesson_completions_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "lesson_related_exercises_module_id_idx" ON "lesson_related_exercises" USING btree ("learning_module_id");
--> statement-breakpoint
CREATE INDEX "user_friends_friend_id_idx" ON "user_friends" USING btree ("friend_id");
--> statement-breakpoint
CREATE INDEX "user_lesson_completions_lesson_id_idx" ON "user_lesson_completions" USING btree ("lesson_id");
--> statement-breakpoint
ALTER TABLE "progress" ADD CONSTRAINT "progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "progress" ADD CONSTRAINT "progress_learning_module_id_learning_modules_id_fk" FOREIGN KEY ("learning_module_id") REFERENCES "public"."learning_modules"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "progress_user_module_unique" ON "progress" USING btree ("user_id","learning_module_id");
--> statement-breakpoint
ALTER TABLE "lessons" DROP COLUMN "related_exercises";
--> statement-breakpoint
ALTER TABLE "progress" DROP COLUMN "user_name";
--> statement-breakpoint
ALTER TABLE "progress" DROP COLUMN "module_name";
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "finished_lessons";
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "friends";
