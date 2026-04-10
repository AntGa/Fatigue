import {
  check,
  pgEnum,
  pgTable,
  real,
  text,
  unique,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { user } from "./auth.js";
import { muscleGroups } from "./muscles.js";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const exerciseType = pgEnum("exercise_type", ["lift", "run"]);

export const equipmentType = pgEnum("equipment_type", [
  "barbell",
  "dumbbell",
  "machine",
  "cable",
  "bodyweight",
  "other",
]);

// ─── exercises ────────────────────────────────────────────────────────────────
// Canonical movement. Fatigue muscle mappings are defined here.
// Default exercises ship with the app; users can create custom ones.
// Default muscle mappings cannot be edited by users.

export const exercises = pgTable("exercises", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: exerciseType("type").notNull(),
  // null = default (ships with app), user_id = custom exercise
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
});

export type Exercise = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;

// ─── exercise_muscles ─────────────────────────────────────────────────────────
// Maps an exercise to the muscle groups it works.
// coefficient: 1.0 = primary, 0.4 = secondary (reduced fatigue contribution).
// Users cannot edit mappings for default exercises.
//
// OWNERSHIP: service layer must verify caller owns the exercise before inserting.
// coefficient is constrained to (0, 1] at the DB level.

export const exerciseMuscles = pgTable(
  "exercise_muscles",
  {
    id: text("id").primaryKey(),
    exerciseId: text("exercise_id")
      .notNull()
      .references(() => exercises.id, { onDelete: "cascade" }),
    muscleGroupId: text("muscle_group_id")
      .notNull()
      .references(() => muscleGroups.id),
    // 1.0 = primary muscle, 0.4 = secondary. Constrained at DB level.
    coefficient: real("coefficient").notNull(),
  },
  (t) => [
    unique().on(t.exerciseId, t.muscleGroupId),
    check(
      "coefficient_range",
      sql`${t.coefficient} > 0 AND ${t.coefficient} <= 1`
    ),
  ]
);

export type ExerciseMuscle = typeof exerciseMuscles.$inferSelect;
export type NewExerciseMuscle = typeof exerciseMuscles.$inferInsert;

// ─── exercise_variants ────────────────────────────────────────────────────────
// Specific implementations of a movement — machine brand, equipment type, gym.
// set_logs references this table, not exercises directly.
// Progression is tracked per variant; fatigue rolls up via variant → exercise.
//
// OWNERSHIP: Postgres CHECK constraints cannot reference other tables, so
// cross-table ownership (variant.userId == exercise.userId) cannot be enforced
// at the DB level without a trigger. Enforced at the service layer:
//   - Default variants (userId IS NULL) may only reference default exercises.
//   - Custom variants (userId IS NOT NULL) may only reference exercises owned
//     by the same user. Verify exercise.userId == session.userId before insert.

export const exerciseVariants = pgTable("exercise_variants", {
  id: text("id").primaryKey(),
  exerciseId: text("exercise_id")
    .notNull()
    .references(() => exercises.id, { onDelete: "cascade" }),
  name: text("name").notNull(), // e.g. "Barbell", "Hammer Strength"
  equipmentType: equipmentType("equipment_type").notNull(),
  notes: text("notes"), // e.g. "XYZ Gym — stack goes to 120kg"
  // null = default variant (ships with app), user_id = custom
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
});

export type ExerciseVariant = typeof exerciseVariants.$inferSelect;
export type NewExerciseVariant = typeof exerciseVariants.$inferInsert;
