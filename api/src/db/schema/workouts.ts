import {
  integer,
  pgTable,
  real,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { user } from "./auth.js";
import { exercises, exerciseVariants } from "./exercises.js";

// ─── workout_sessions ─────────────────────────────────────────────────────────
// Header for a lifting session. Sets are children of this record.
// endedAt is null while the workout is in progress.

export const workoutSessions = pgTable("workout_sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  startedAt: timestamp("started_at").notNull(),
  endedAt: timestamp("ended_at"),
  notes: text("notes"),
});

export type WorkoutSession = typeof workoutSessions.$inferSelect;
export type NewWorkoutSession = typeof workoutSessions.$inferInsert;

// ─── workout_exercise_notes ───────────────────────────────────────────────────
// Per-exercise notes within a session — e.g. "left shoulder clicking on bench".
// Scoped to exercise (not variant) since the note is about the movement pattern,
// not the specific machine.

export const workoutExerciseNotes = pgTable(
  "workout_exercise_notes",
  {
    id: text("id").primaryKey(),
    workoutSessionId: text("workout_session_id")
      .notNull()
      .references(() => workoutSessions.id, { onDelete: "cascade" }),
    exerciseId: text("exercise_id")
      .notNull()
      .references(() => exercises.id),
    notes: text("notes").notNull(),
  },
  (t) => [unique().on(t.workoutSessionId, t.exerciseId)]
);

export type WorkoutExerciseNote = typeof workoutExerciseNotes.$inferSelect;
export type NewWorkoutExerciseNote = typeof workoutExerciseNotes.$inferInsert;

// ─── set_logs ─────────────────────────────────────────────────────────────────
// One row per logged set. References exercise_variants (not exercises directly)
// so progression is tracked per variant (machine/equipment).
//
// Fatigue rolls up at write time:
//   variant → exercise → exercise_muscles → muscle_group fatigue_events
//
// e1RM stored at write — cheap to compute, expensive to recalculate at scale.
//   RIR = 10 - rpe
//   e1rm = weight × (1 + (reps + RIR) / 30)

export const setLogs = pgTable("set_logs", {
  id: text("id").primaryKey(),
  workoutSessionId: text("workout_session_id")
    .notNull()
    .references(() => workoutSessions.id, { onDelete: "cascade" }),
  exerciseVariantId: text("exercise_variant_id")
    .notNull()
    .references(() => exerciseVariants.id),
  // Explicit ordering — do not rely on insert order
  setNumber: integer("set_number").notNull(),
  // Always stored in kg — unit conversion handled in the UI
  weight: real("weight").notNull(),
  reps: integer("reps").notNull(),
  // RPE 7.0–10.0, half-point precision (e.g. 7.5). Required for fatigue model.
  rpe: real("rpe").notNull(),
  // Computed at write: weight × (1 + (reps + (10 - rpe)) / 30)
  e1rm: real("e1rm").notNull(),
  notes: text("notes"),
  loggedAt: timestamp("logged_at").notNull(),
});

export type SetLog = typeof setLogs.$inferSelect;
export type NewSetLog = typeof setLogs.$inferInsert;
