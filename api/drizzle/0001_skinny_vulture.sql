CREATE TYPE "public"."equipment_type" AS ENUM('barbell', 'dumbbell', 'machine', 'cable', 'bodyweight', 'other');--> statement-breakpoint
CREATE TYPE "public"."exercise_type" AS ENUM('lift', 'run');--> statement-breakpoint
CREATE TYPE "public"."fatigue_event_source" AS ENUM('workout', 'run', 'decay', 'checkin');--> statement-breakpoint
CREATE TABLE "muscle_groups" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"is_cns" boolean DEFAULT false NOT NULL,
	"sort_order" integer NOT NULL,
	CONSTRAINT "muscle_groups_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "exercise_muscles" (
	"id" text PRIMARY KEY NOT NULL,
	"exercise_id" text NOT NULL,
	"muscle_group_id" text NOT NULL,
	"coefficient" real NOT NULL,
	CONSTRAINT "exercise_muscles_exercise_id_muscle_group_id_unique" UNIQUE("exercise_id","muscle_group_id")
);
--> statement-breakpoint
CREATE TABLE "exercise_variants" (
	"id" text PRIMARY KEY NOT NULL,
	"exercise_id" text NOT NULL,
	"name" text NOT NULL,
	"equipment_type" "equipment_type" NOT NULL,
	"notes" text,
	"user_id" text
);
--> statement-breakpoint
CREATE TABLE "exercises" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" "exercise_type" NOT NULL,
	"user_id" text
);
--> statement-breakpoint
CREATE TABLE "set_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"workout_session_id" text NOT NULL,
	"exercise_variant_id" text NOT NULL,
	"set_number" integer NOT NULL,
	"weight" real NOT NULL,
	"reps" integer NOT NULL,
	"rpe" real NOT NULL,
	"e1rm" real NOT NULL,
	"notes" text,
	"logged_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workout_exercise_notes" (
	"id" text PRIMARY KEY NOT NULL,
	"workout_session_id" text NOT NULL,
	"exercise_id" text NOT NULL,
	"notes" text NOT NULL,
	CONSTRAINT "workout_exercise_notes_workout_session_id_exercise_id_unique" UNIQUE("workout_session_id","exercise_id")
);
--> statement-breakpoint
CREATE TABLE "workout_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"started_at" timestamp NOT NULL,
	"ended_at" timestamp,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "daily_check_ins" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"date" date NOT NULL,
	"sleep_hours" real NOT NULL,
	"feel_score" integer NOT NULL,
	"notes" text,
	"logged_at" timestamp NOT NULL,
	CONSTRAINT "daily_check_ins_user_id_date_unique" UNIQUE("user_id","date")
);
--> statement-breakpoint
CREATE TABLE "fatigue_events" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"muscle_group_id" text NOT NULL,
	"fatigue_level" real NOT NULL,
	"predicted_level" real,
	"source" "fatigue_event_source" NOT NULL,
	"logged_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_muscle_config" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"muscle_group_id" text NOT NULL,
	"half_life_hours" real NOT NULL,
	"mrv" real NOT NULL,
	CONSTRAINT "user_muscle_config_user_id_muscle_group_id_unique" UNIQUE("user_id","muscle_group_id")
);
--> statement-breakpoint
ALTER TABLE "exercise_muscles" ADD CONSTRAINT "exercise_muscles_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_muscles" ADD CONSTRAINT "exercise_muscles_muscle_group_id_muscle_groups_id_fk" FOREIGN KEY ("muscle_group_id") REFERENCES "public"."muscle_groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_variants" ADD CONSTRAINT "exercise_variants_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_variants" ADD CONSTRAINT "exercise_variants_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "set_logs" ADD CONSTRAINT "set_logs_workout_session_id_workout_sessions_id_fk" FOREIGN KEY ("workout_session_id") REFERENCES "public"."workout_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "set_logs" ADD CONSTRAINT "set_logs_exercise_variant_id_exercise_variants_id_fk" FOREIGN KEY ("exercise_variant_id") REFERENCES "public"."exercise_variants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_exercise_notes" ADD CONSTRAINT "workout_exercise_notes_workout_session_id_workout_sessions_id_fk" FOREIGN KEY ("workout_session_id") REFERENCES "public"."workout_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_exercise_notes" ADD CONSTRAINT "workout_exercise_notes_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_sessions" ADD CONSTRAINT "workout_sessions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_check_ins" ADD CONSTRAINT "daily_check_ins_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fatigue_events" ADD CONSTRAINT "fatigue_events_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fatigue_events" ADD CONSTRAINT "fatigue_events_muscle_group_id_muscle_groups_id_fk" FOREIGN KEY ("muscle_group_id") REFERENCES "public"."muscle_groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_muscle_config" ADD CONSTRAINT "user_muscle_config_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_muscle_config" ADD CONSTRAINT "user_muscle_config_muscle_group_id_muscle_groups_id_fk" FOREIGN KEY ("muscle_group_id") REFERENCES "public"."muscle_groups"("id") ON DELETE no action ON UPDATE no action;